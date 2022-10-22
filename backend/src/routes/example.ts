import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'


async function routes (fastify: FastifyInstance, options: any) {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        return { hello: 'world' };
    });

    server.get('/hey', async (request: FastifyRequest, reply: FastifyReply) => {
        const users = await server.prisma.user.findMany();
        return users;
    });

    server.post('/user', {
        schema: {
            summary: 'Create a new user',
            tags: ['Example'],
            body: Type.Object({
                name: Type.String(),
                email: Type.String(),
                password: Type.String(),
            }),
            response: {
                200: Type.Object({
                    id: Type.Number(),
                }),
            }
        }
    }, async (request) => {
        await server.prisma.user.create({
            data: {
                name: request.body.name,
                email: request.body.email,
                password: request.body.password,
            }
        });
        console.log(request.body);
    });    

}

module.exports = routes
export const autoPrefix = '/users'
