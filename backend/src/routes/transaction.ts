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
        }
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
        }
    }, async (request, reply) => {
        const transaction = await server.prisma.transaction.findUnique({
            where: {
                id: Number(request.params.id),
            },
        });
        
        if (!transaction) {
            reply.code(404);
            return { message: 'Transaction not found' };
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
        }
    }, async (request, reply) => {
        const paymentMethod = await server.prisma.paymentMethod.findUnique({
            where: {
                id: Number(request.body.paymentMethodId),
            },
        });

        if (!paymentMethod) {
            reply.code(400);
            return { message: 'Payment method not found' };
        } else if (!paymentMethod.status){
            await server.prisma.transaction.create({
                data: {
                    amount: request.body.amount,
                    description: request.body.description,
                    status: "Rechazada, Método de pago inactivo",
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
            reply.code(400);
            return { message: 'Payment method is not active' };
        }

        if (paymentMethod.balance < request.body.amount) {
            await server.prisma.transaction.create({
                data: {
                    amount: request.body.amount,
                    description: request.body.description,
                    status: "Rechazada, Fondos insuficientes",
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

            reply.code(400);
            return { message: 'Insufficient balance' };
        }

        await server.prisma.transaction.create({
            data: {
                amount: request.body.amount,
                description: request.body.description,
                status: 'Aprobada',
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

}

module.exports = routes;