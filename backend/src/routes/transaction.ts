import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'

async function routes(fastify: FastifyInstance, options: any){
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/transactions', {
        schema: {
            tags: ['Transaction'],
            response: {
                200: Type.Array(Type.Object({
                    id: Type.Number(),
                    amount: Type.Number(),
                    description: Type.String(),
                    status: Type.String(),
                })),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const transactions = await server.prisma.transaction.findMany();
        return transactions;
    });

    server.get('/transaction/:id', {
        schema: {
            tags: ['Transaction'],
            params: Type.Object({
                id: Type.Number(),
            }),
            response: {
                200: Type.Object({
                    id: Type.Number(),
                    amount: Type.Number(),
                    description: Type.String(),
                    status: Type.String(),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        
        const transaction = await server.prisma.transaction.findUnique({
            where: {
                id: Number(request.params.id),
            },
        });
        
        if (!transaction) {
            return reply.notFound("Transaction not found");
        }
        
        return transaction;
    });

    server.get('/transaction/user/:id', {
        schema: {
            tags: ['Transaction'],
            summary: 'Get all transactions of the logged user',
            params: Type.Object({
                id: Type.Number(),
            }),
            response: {
                200: Type.Array(Type.Object({
                    id: Type.Number(),
                    amount: Type.Number({ exclusiveMinimum: 0 }),
                    description: Type.String(),
                    status: Type.String(),
                    createdAt: Type.Any(),
                })),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.queryAllowed],
        preHandler: [fastify.isOwner],
    }, async (request, reply) => {
        const transactions = await server.prisma.transaction.findMany({
            where: {
                userId: Number(request.params.id),
            },
            select: {
                id: true,
                amount: true,
                description: true,
                status: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        
        if (!transactions) {
            return reply.notFound("Transactions not found");
        }
        
        return transactions;
    });

    server.post('/transaction', {
        schema: {
            summary: 'Create a new transaction',
            tags: ['Transaction'],
            body: Type.Object({
                id: Type.Optional(Type.Number(),),
                amount: Type.Number(),
                description: Type.String(),
                userId: Type.Optional(Type.Number()),
                paymentMethodId: Type.Number(),
            }),
            response: {
                201: Type.Object({
                    message: Type.String(),
                }),
                400: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.paymentAllowed],
        onError: [fastify.processPending],
        preHandler: [fastify.stashRequest],
    }, async (request, reply) => {
        // if user is not admin, set userId to logged user
        if (!request.user.isAdmin) {
            request.body.userId = request.user.id;
        }

        const paymentMethod = await server.prisma.paymentMethod.findUnique({
            where: {
                id: Number(request.body.paymentMethodId),
            },
        });

        if (!paymentMethod) {
            return reply.notFound("Payment method not found");
        }  

        if (!paymentMethod.status){
            await server.prisma.transaction.update({
                where: {
                    id: Number(request.body.id),
                },
                data: {
                    status: "Rejected, payment method is disabled",
                },
            });
            return reply.badRequest("Rejected, payment method is disabled");
        } 

        //verify if payment method is expired
        const expDate = new Date(paymentMethod.expiryDate);
        const today = new Date();

        if (expDate < today){
            await server.prisma.transaction.update({
                where: {
                    id: Number(request.body.id),
                },
                data: {
                    status: "Rejected, payment method is expired",
                },
            });
            return reply.badRequest("Rejected, payment method is expired");
        }

        if (paymentMethod.balance < request.body.amount) {
            await server.prisma.transaction.update({
                where: {
                    id: Number(request.body.id),
                },
                data: {
                    status: "Rejected, payment method has insufficient balance",
                },
            });
            reply.badRequest("Rejected, payment method has insufficient balance");
        }

        await server.prisma.transaction.update({
            where: {
                id: Number(request.body.id),
            },
            data: {
                status: "Approved",
            },
        });

        await server.prisma.paymentMethod.update({
            where: {
                id: Number(request.body.paymentMethodId),
            },
            data: {
                balance: paymentMethod.balance - request.body.amount,
            },
        });

        reply.send({ message: "Transaction approved" });
    });

}

module.exports = routes;