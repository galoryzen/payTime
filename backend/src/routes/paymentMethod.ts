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
        preValidation: [fastify.verifyAuth],
        preHandler: [fastify.isPaymentOwner],
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

    server.get('/paymentMethod/user/:id', {
        schema: {
            tags: ['PaymentMethod'],
            summary: 'Get all payment methods of the logged user',
            params: Type.Object({
                id: Type.Number(),
            }),
            response: {
                200: Type.Array(Type.Object({
                    cardNumber: Type.String(),
                    balance: Type.Number(),
                    bankName: Type.String(),
                })),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        onRequest: [fastify.queryAllowed],
        preValidation: [fastify.verifyAuth],
        preHandler: [fastify.isOwner],
    }, async (request, reply) => {
        console.log(request.user.id);
        const paymentMethods = await server.prisma.paymentMethod.findMany({
            where: {
                userId: Number(request.params.id),
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
                balance: paymentMethod.balance,
                bankName: paymentMethod.bank.name,
            }
        });

        return paymentMethodsResponse;
    });

    server.post('/paymentMethod', {
        schema: {
            summary: 'Create a new paymentMethod',
            tags: ['PaymentMethod'],
            body: Type.Object({
                balance: Type.Optional(Type.Number()),
                status: Type.Optional(Type.Boolean()),
                tipo: Type.String(),
                cardNumber: Type.String(),
                bankId: Type.Number(),
                userId: Type.Optional(Type.Number()),
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
        //verify if the user creating the paymentMethod is admin
        if(request.user.isAdmin){
            //verify balance, status and userId are not null
            if(!request.body.balance || !request.body.status || !request.body.userId){
                return reply.badRequest("Balance, status and userId are required for admin requests");
            }
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
        }

        //if user isn't admin balance will be 0 and status will be false, also we will use the user id from the token
        //first we need to validate if the credit card number is visa, mastercard or american express
        const cardNumber = request.body.cardNumber;
        const cardNumberFirstDigit = cardNumber.charAt(0);
        const cardNumberSecondDigit = cardNumber.charAt(1);
        
        if(cardNumberFirstDigit == '4'|| (cardNumberFirstDigit == '5' && cardNumberSecondDigit >= '1' && cardNumberSecondDigit <= '5') || (cardNumberFirstDigit == '3' && (cardNumberSecondDigit == '4' || cardNumberSecondDigit == '7'))){
            //if the credit card number is valid we create the paymentMethod
            try{
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
            } catch(error){
                return reply.badRequest("Error creating paymentMethod");
            }
        } else {
            return reply.badRequest("Credit card number is not valid for Visa, Mastercard or American Express");
        }
        return { message: 'PaymentMethod created' };
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
        onRequest: [fastify.queryAllowed],
        preValidation: [fastify.verifyAuth],
        preHandler: [fastify.isPaymentOwner],
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