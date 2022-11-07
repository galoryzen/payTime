import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        verifyAuth: () => Promise<void>,
        isAdmin: () => Promise<void>,
    }
}

const authPlugin = fp(async (fastify, opts) => {
    fastify.decorate('verifyAuth', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    fastify.decorate('isAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            //get user id from body
            const id = request.user?.id

            const user = await fastify.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if(!user){
                return reply.unauthorized('Invalid user');
            }
            if(!user.isAdmin){
                reply.unauthorized("You are not authorized to perform this action");
            }
            

        } catch (err) {
            reply.send(err);
        }
    });
});

export default authPlugin;