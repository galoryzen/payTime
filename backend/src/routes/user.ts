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

    server.get('/user/:id/transactions', {
        schema: {
            summary: 'Get all transactions of a user',
            tags: ['User'],
            params: Type.Object({
                id: Type.Number(),
            }),
            
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
            const transactions = await server.prisma.transaction.findMany({
                where: {
                    userId: Number(request.params.id),
                },
                include: {
                    paymentMethod: {
                        include: {
                            bank: true,
                        }
                    }
                }
            });
            return transactions;

        } catch (error) {
            return reply.internalServerError("Error getting transactions");
        }
    });
}

module.exports = routes
export const autoPrefix = '/user';