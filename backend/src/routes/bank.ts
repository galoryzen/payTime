import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'

async function routes(fastify: FastifyInstance, options: any){
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/banks', {
        schema: {
            tags: ['Bank'],
            response: {
                200: Type.Array(Type.Object({
                    id: Type.Number(),
                    name: Type.String(),
                })),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const banks = await server.prisma.bank.findMany();
        return banks;
    });

    server.get('/bank/:id', {
        schema: {
            tags: ['Bank'],
            params: Type.Object({
                id: Type.Number(),
            }),
            response: {
                200: Type.Object({
                    id: Type.Number(),
                    name: Type.String(),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        const bank = await server.prisma.bank.findUnique({
            where: {
                id: Number(request.params.id),
            },
        });
        
        if (!bank) {
            return reply.notFound("Bank not found");
        }
        
        return bank;
    });

    server.post('/bank', {
        schema: {
            summary: 'Create a new bank',
            tags: ['Bank'],
            body: Type.Object({
                name: Type.String(),
            }),
            response: {
                201: Type.Object({
                    message: Type.String(),
                }),
                500: Type.Object({
                    message: Type.String(),
                }),
            }
        },
        preValidation: [fastify.verifyAuth, fastify.isAdmin],
    }, async (request, reply) => {
        try {
            await server.prisma.bank.create({
                data: {
                    name: request.body.name,
                },
            });
            reply.send({ message: "Bank created" });
        } catch (error) {
            console.log(error);
            return reply.internalServerError("Error creating bank");
        }
    });
}

module.exports = routes;