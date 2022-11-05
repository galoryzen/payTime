import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async (fastify, opts) => {
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});