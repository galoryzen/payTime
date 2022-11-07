import jwt, { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
    interface FastifyInstance {
        queryAllowed: () => Promise<void>,
        paymentAllowed: () => Promise<void>,
    }
}

export default fp(async (fastify, opts) => {
    fastify.decorate('queryAllowed', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.unauthorized()
    })
})
