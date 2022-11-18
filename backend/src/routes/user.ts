import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import bcrypt from 'bcrypt';
import { request } from 'http';


async function routes(fastify: FastifyInstance, options: any) {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/users', {
        schema: {
            tags: ['User'],
            summary: 'Get all users',
            response: {
                200: Type.Array(Type.Object({
                    id: Type.Number(),
                    name: Type.String(),
                    email: Type.String(),
                })),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const users = await server.prisma.user.findMany();
        return users;
    });

    server.get('/user/:id', {
        schema: {
            tags: ['User'],
            summary: 'Get a user by id',
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
        },
        preValidation: [fastify.verifyAuth],
        preHandler: [fastify.isOwner],
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

    //only admins can create users for this app
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
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        try {
            await server.prisma.user.create({
                data: {
                    name: request.body.name,
                    email: request.body.email,
                    password: hashedPassword,
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
        },
        preValidation: [fastify.verifyAuth],
        preHandler: [fastify.isOwner],
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
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
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
}

module.exports = routes
export const autoPrefix = '/user';