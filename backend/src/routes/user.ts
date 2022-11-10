import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'


async function routes(fastify: FastifyInstance, options: any) {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/users', {
        schema: {
            tags: ['User'],
            response: {
                200: Type.Array(Type.Object({
                    id: Type.Number(),
                    name: Type.String(),
                    email: Type.String(),
                })),
            }
        }
    }, async (request, reply) => {
        const users = await server.prisma.user.findMany();
        return users;
    });

    server.get('/user/:id', {
        schema: {
            tags: ['User'],
            params: Type.Object({
                id: Type.Number(),
            }),
            response: {
                200: Type.Object({
                    id: Type.Number(),
                    name: Type.String(),
                    email: Type.String(),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        }
    }, async (request, reply) => {
        const user = await server.prisma.user.findUnique({
            where: {
                id: Number(request.params.id),
            },
        });
        
        if (!user) {
            return reply.notFound("User not found");
        }
        
        return user;
    });  

    server.post('/user', {
        schema: {
            summary: 'Create a new user',
            tags: ['User'],
            body: Type.Object({
                name: Type.String(),
                email: Type.String(),
                password: Type.String(),
            }),
            response: {
                201: Type.Object({
                    respond: Type.String(),
                }),
            }
        }
    }, async (request, reply) => {
        try {
            await server.prisma.user.create({
                data: {
                    name: request.body.name,
                    email: request.body.email,
                    password: request.body.password,
                }
            });
            return reply.status(200).send({ respond: 'User created' });

        } catch (error) {
            console.log(error);
            return reply.internalServerError("Error creating user");
        }
    });

    server.put('/user/:id', {
        schema: {
            summary: 'Update a user',
            tags: ['User'],
            params: Type.Object({
                id: Type.Number(),
            }),
            body: Type.Object({
                name: Type.String(),
                email: Type.String(),
                password: Type.String(),
            }),
            response: {
                200: Type.Object({
                    message: Type.String(),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
                500: Type.Object({
                    message: Type.String(),
                }),
            }
        }
    }, async (request, reply) => {
        const user = await server.prisma.user.findUnique({
            where: {
                id: Number(request.params.id),
            },
        });
        
        if (!user) {
            return reply.notFound("User not found");
        }

        try {
            await server.prisma.user.update({
                where: {
                    id: Number(request.params.id),
                },
                data: {
                    name: request.body.name,
                    email: request.body.email,
                    password: request.body.password,
                }
            });
            return reply.status(200).send({ message: 'User updated' });

        } catch (error) {
            console.log(error);
            return reply.internalServerError("Error updating user");
        }
    });
    
    server.delete('/user/:id', {
        schema: {
            summary: 'Delete a user',
            tags: ['User'],
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
                500: Type.Object({
                    message: Type.String(),
                }),
            }
        }
    }, async (request, reply) => {
        const user = await server.prisma.user.findUnique({
            where: {
                id: Number(request.params.id),
            },
        });
        
        if (!user) {
            return reply.notFound("User not found");
        }

        try {
            await server.prisma.user.delete({
                where: {
                    id: Number(request.params.id),
                }
            });
            return reply.status(200).send({ message: 'User deleted' });

        } catch (error) {
            console.log(error);
            return reply.internalServerError("Error deleting user");
        }
    });

    server.get('/user/transactions', {
        schema: {
            tags: ['Transaction'],
            summary: 'Get all transactions of the logged user',
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
        preValidation: [fastify.verifyAuth],
    }, async (request, reply) => {
        const transactions = await server.prisma.transaction.findMany({
            where: {
                userId: Number(request.user.id),
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

    server.get('/user/paymentMethods', {
        schema: {
            tags: ['PaymentMethod'],
            summary: 'Get all payment methods of the logged user',
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
                userId: Number(request.user.id),
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
}

module.exports = routes
export const autoPrefix = '/user';