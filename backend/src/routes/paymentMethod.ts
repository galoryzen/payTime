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
                    bank: Type.Object({
                        id: Type.Number(),
                        name: Type.String(),
                    }),
                })),
            }
        }
    }, async (request, reply) => {
        const paymentMethods = await server.prisma.paymentMethod.findMany(
            {
                include: {
                    bank: true,
                },
            }
        );
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
                    bank: Type.Object({
                        id: Type.Number(),
                        name: Type.String(),
                    }),
                }),
                404: Type.Object({
                    message: Type.String(),
                }),
            }
        }
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
            reply.code(404);
            return { message: 'PaymentMethod not found' };
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
        }
    }, async (request, reply) => {
        const paymentMethod = await server.prisma.paymentMethod.create({
            data: {
                balance: request.body.balance,
                status: request.body.status,
                tipo: request.body.tipo,
                bankId: request.body.bankId,
                userId: request.body.userId,
            },
        });
        
        if (!paymentMethod) {
            reply.code(404);
            return { message: 'PaymentMethod not created' };
        }
        
        return { message: 'PaymentMethod created' };
    });

}

module.exports = routes;