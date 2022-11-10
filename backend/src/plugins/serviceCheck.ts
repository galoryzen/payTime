import jwt, { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
//import Type
import { Type, Static } from '@sinclair/typebox';

declare module 'fastify' {
    interface FastifyInstance {
        queryAllowed: () => Promise<void>,
        paymentAllowed: () => Promise<void>,
    }
}

//params schema
const paramsSchema = Type.Object({
    id: Type.Number(),
});

export default fp(async (fastify, opts) => {    


    fastify.decorate('queryAllowed', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as Static<typeof paramsSchema>;
        //get payment method an bring bank id
        const paymentMethod = await fastify.prisma.paymentMethod.findUnique({
            where: {
                id: id,
            },
            include: {
                bank: true,
            },
        });
        if (!paymentMethod) {
            return reply.notFound("Payment method not found");
        }

        const queryAllowed = await fastify.prisma.bank.findUnique({
            where: {
                id: paymentMethod.bank.id,
            },
            select: {
                queryStatus: true,
            },
        });
        
        if (!queryAllowed) {
            return reply.notFound("Bank not found");
        }

        if (!queryAllowed.queryStatus) {
            return reply.unauthorized("Service not available");
        }
    })
})
