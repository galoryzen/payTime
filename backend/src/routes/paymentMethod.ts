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
                    expiryDate: Type.String({ format: 'date' }),
                    CVV: Type.String(),
                    name: Type.String(),
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
                    name: Type.String(),
                    balance: Type.Number(),
                    status: Type.Boolean(),
                    tipo: Type.String(),
                    provider: Type.String(),
                    expiryDate: Type.String({ format: 'date' }),
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
                    id: Type.Number(),
                    name: Type.String(),
                    cardNumber: Type.String(),
                    provider: Type.String(),
                    expiryDate: Type.String({ format: 'date' }),
                    bankName: Type.String(),
                })),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.queryAllowed],
        preHandler: [fastify.isOwner],
    }, async (request, reply) => {
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
                id: paymentMethod.id,
                name: paymentMethod.name,
                cardNumber: paymentMethod.cardNumber,
                provider: paymentMethod.provider,
                expiryDate: paymentMethod.expiryDate,
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
                name: Type.String(),
                balance: Type.Optional(Type.Number()),
                status: Type.Optional(Type.Boolean()),
                tipo: Type.String(),
                cardNumber: Type.Number({ minimum: 1000000000000, maximum: 9999999999999999 }),
                CVV: Type.Number({ minimum: 100, maximum: 9999 }),
                expiryDate: Type.String({ format: 'date' }),
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
        //verify expiry date
        const expiryDate = new Date(request.body.expiryDate);
        const today = new Date();
        if (expiryDate < today) {
            return reply.badRequest("Expiry date is invalid");
        }

        //get request.body.cardNumber as a string
        const cardNumber = request.body.cardNumber.toString();
        const cardNumberFirstDigit = cardNumber.charAt(0);
        const cardNumberSecondDigit = cardNumber.charAt(1);

        var provider = '';
        //get card provider
        if(cardNumberFirstDigit == '4'){
            provider = 'VISA';
        }else if(cardNumberFirstDigit == '5'){
            provider = 'MASTERCARD';
        }else if(cardNumberFirstDigit == '3' && cardNumberSecondDigit == '4' || cardNumberSecondDigit == '7'){
            provider = 'AMEX';
        }else{
            return reply.badRequest("Invalid card number");
        }

        //verify if the user creating the paymentMethod is admin
        if(request.user.isAdmin){
            //verify balance, status and userId are not null
            if(!request.body.balance || !request.body.status || !request.body.userId){
                return reply.badRequest("Balance, status and userId are required for admin requests");
            }
            try{
                const paymentMethod = await server.prisma.paymentMethod.create({
                    data: {
                        name: request.body.name,
                        balance: request.body.balance,
                        status: request.body.status,
                        tipo: request.body.tipo,
                        cardNumber: cardNumber,
                        provider: provider,
                        CVV: request.body.CVV.toString(),
                        expiryDate: request.body.expiryDate,
                        bankId: request.body.bankId,
                        userId: request.body.userId,
                    },
                });
            }catch(error){
                console.log(error);
                return reply.badRequest("Unable to create payment method");
            } 
        }

        //if user isn't admin balance will be 0 and status will be false, also we will use the user id from the token        
        try{
            const paymentMethod = await server.prisma.paymentMethod.create({
                data: {
                    name: request.body.name,
                    balance: 0,
                    status: false,
                    tipo: request.body.tipo,
                    cardNumber: cardNumber,
                    provider: provider,
                    CVV: request.body.CVV.toString(),
                    expiryDate: request.body.expiryDate,
                    bankId: request.body.bankId,
                    userId: request.user.id,
                },
            });
        } catch(error){
            console.log(error);
            return reply.badRequest("Error creating paymentMethod");
        }
        return { message: 'PaymentMethod created' };
    });

    server.delete('/paymentMethod/:id', {
        schema: {
            summary: 'Delete a paymentMethod',
            tags: ['PaymentMethod'],
            params: Type.Object({
                id: Type.Number(),
            }),
            response: {
                200: Type.Object({
                    message: Type.String(),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth],
        preHandler: [fastify.isPaymentOwner],
    }, async (request, reply) => {
        const paymentMethod = await server.prisma.paymentMethod.delete({
            where: {
                id: Number(request.params.id),
            },
        });

        if (!paymentMethod) {
            return reply.notFound("PaymentMethod not found");
        }

        return { message: 'PaymentMethod deleted' };
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
        preValidation: [fastify.verifyAuth, fastify.queryAllowed],
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