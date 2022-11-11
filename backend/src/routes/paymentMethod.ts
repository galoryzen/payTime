import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'

async function routes(fastify: FastifyInstance, options: any){
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/paymentMethods', {
        schema: {
            tags: ['PaymentMethod'],
            response: {
                200: Type.Array(Type.Object({
                    id: Type.Number(),
                    balance: Type.Number(),
                    status: Type.Boolean(),
                    tipo: Type.String(),
                    cardNumber: Type.String(),
                    bank: Type.Object({
                        id: Type.Number(),
                        name: Type.String(),
                    }),
                })),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const paymentMethods = await server.prisma.paymentMethod.findMany({
            include: {
                bank: true,
            }
        });
        return paymentMethods;
    });

    server.get('/paymentMethod/:id', {
        schema: {
            tags: ['PaymentMethod'],
            params: Type.Object({
                id: Type.Number(),
            }),
            response: {
                200: Type.Object({
                    id: Type.Number(),
                    balance: Type.Number(),
                    status: Type.Boolean(),
                    tipo: Type.String(),
                    cardNumber: Type.String(),
                    bank: Type.Object({
                        id: Type.Number(),
                        name: Type.String(),
                    }),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const paymentMethod = await server.prisma.paymentMethod.findUnique({
            where: {
                id: Number(request.params.id),
            },
            include: {
                bank: true,
            },
        });
        
        if (!paymentMethod) {
            return reply.notFound("PaymentMethod not found");
        }
        
        return paymentMethod;
    });

    server.post('/paymentMethod', {
        schema: {
            summary: 'Create a new paymentMethod',
            tags: ['PaymentMethod'],
            body: Type.Object({
                balance: Type.Number(),
                status: Type.Boolean(),
                tipo: Type.String(),
                cardNumber: Type.String(),
                bankId: Type.Number(),
                userId: Type.Number(),
            }),
            response: {
                201: Type.Object({
                    message: Type.String(),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const paymentMethod = await server.prisma.paymentMethod.create({
            data: {
                balance: request.body.balance,
                status: request.body.status,
                tipo: request.body.tipo,
                cardNumber: request.body.cardNumber,
                bankId: request.body.bankId,
                userId: request.body.userId,
            },
        });
        
        if (!paymentMethod) {
            return reply.notFound("PaymentMethod not found");
        }
        
        return { message: 'PaymentMethod created' };
    });

    server.post('/paymentMethod/user', {
        schema: {
            summary: 'Create a new paymentMethod',
            tags: ['PaymentMethod'],
            body: Type.Object({
                tipo: Type.String(),
                cardNumber: Type.String(),
                bankId: Type.Number(),
            }),
            response: {
                201: Type.Object({
                    message: Type.String(),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth],
    }, async (request, reply) => {
        //verify if credit card number is valid
        

        const paymentMethod = await server.prisma.paymentMethod.create({
            data: {
                balance: 0,
                status: false,
                tipo: request.body.tipo,
                cardNumber: request.body.cardNumber,
                bankId: request.body.bankId,
                userId: request.user.id,
            },
        });
    });

    server.get('/paymentMethod/user/:userid', {
        schema: {
            tags: ['PaymentMethod'],
            params: Type.Object({
                userid: Type.Number(),
            }),
            response: {
                200: Type.Array(Type.Object({
                    cardNumber: Type.String(),
                    bankName: Type.String(),
                })),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        }
    }, async (request, reply) => {
        const paymentMethods = await server.prisma.paymentMethod.findMany({
            where: {
                userId: Number(request.params.userid),
            },
            include: {
                bank: true,
            },
        });

        if (!paymentMethods) {
            return reply.notFound("PaymentMethod not found");
        }

        const paymentMethodsResponse = paymentMethods.map((paymentMethod) => {
            return {
                cardNumber: paymentMethod.cardNumber,
                bankName: paymentMethod.bank.name,
            }
        });

        return paymentMethodsResponse;
    });



    server.get('/saldo/:id', {
        schema: {
            tags: ['PaymentMethod'],
            params: Type.Object({
                id: Type.Number(),
            }),
            response: {
                200: Type.Object({
                    saldo: Type.Number(),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preHandler: [fastify.queryAllowed],
    }, async (request, reply) => {
        const paymentMethod = await server.prisma.paymentMethod.findUnique({
            where: {
                id: Number(request.params.id),
            },
        });
        
        if (!paymentMethod) {
            return reply.notFound("PaymentMethod not found");
        }
        
        return { saldo: paymentMethod.balance };
        
    });

}

module.exports = routes;