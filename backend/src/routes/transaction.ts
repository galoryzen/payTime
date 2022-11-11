import { PrismaClient } from '@prisma/client';
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

    server.post('/transaction', {
        schema: {
            summary: 'Create a new transaction',
            tags: ['Transaction'],
            body: Type.Object({
                amount: Type.Number(),
                description: Type.String(),
                userId: Type.Number(),
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
        onRequest: fastify.paymentAllowed,
        preValidation: fastify.verifyAuth,
    }, async (request, reply) => {
        const paymentMethod = await server.prisma.paymentMethod.findUnique({
            where: {
                id: Number(request.body.paymentMethodId),
            },
        });

        if (!paymentMethod) {
            return reply.notFound("Payment method not found");
            
        } else if (!paymentMethod.status){
            await server.prisma.transaction.create({
                data: {
                    amount: request.body.amount,
                    description: request.body.description,
                    status: "Rejected, payment method is disabled",
                    user: {
                        connect: {
                            id: Number(request.body.userId),
                        },
                    },
                    paymentMethod: {
                        connect: {
                            id: Number(request.body.paymentMethodId),
                        },
                    },
                },
            });
            return reply.badRequest("Rejected, payment method is disabled");
        }

        if (paymentMethod.balance < request.body.amount) {
            await server.prisma.transaction.create({
                data: {
                    amount: request.body.amount,
                    description: request.body.description,
                    status: "Rejected, payment method has insufficient balance",
                    user: {
                        connect: {
                            id: Number(request.body.userId),
                        },
                    },
                    paymentMethod: {
                        connect: {
                            id: Number(request.body.paymentMethodId),
                        },
                    },
                },
            });

            reply.badRequest("Rejected, payment method has insufficient balance");
        }

        await server.prisma.transaction.create({
            data: {
                amount: request.body.amount,
                description: request.body.description,
                status: 'Approved',
                user: {
                    connect: {
                        id: Number(request.body.userId),
                    },
                },
                paymentMethod: {
                    connect: {
                        id: Number(request.body.paymentMethodId),
                    },
                },
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

        reply.code(201);
        return { message: 'Transaction Approved' };
    });
    
    server.get('/transactions/user/:userid', {
        schema: {
            tags: ['Transaction'],
            summary: 'Get all transactions of a user',
            params: Type.Object({
                userid: Type.Number(),
            }),
            response: {
                200: Type.Array(Type.Object({
                    id: Type.Number(),
                    amount: Type.Number(),
                    description: Type.String(),
                    status: Type.String(),
                    createdAt: Type.Any(),
                })),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const transactions = await server.prisma.transaction.findMany({
            where: {
                userId: Number(request.params.userid),
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

}

module.exports = routes;