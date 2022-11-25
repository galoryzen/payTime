import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
    interface FastifyInstance {
        queryAllowed: () => Promise<void>,
        paymentAllowed: () => Promise<void>,
        balanceAllowed: () => Promise<void>,
    }
}

export default fp(async (fastify, opts) => { 
    //Check if query is allowed for user   
    fastify.decorate('queryAllowed', async (request: FastifyRequest, reply: FastifyReply, done: any) => {
        if(request.user.isAdmin){
            done();
        }

        const status = await fastify.prisma.service.findUnique({
            where: {
                name: "query"
            },
            select: {
                status: true
            }
        });
        if(!status){
            return reply.notFound("Service not found");
        }
        if(!status.status){
            return reply.serviceUnavailable("Service is currently unavailable");
        }
    })

    //Check if payment is allowed for user
    fastify.decorate('paymentAllowed', async (request: FastifyRequest, reply: FastifyReply, done: any) => {
        if(request.user.isAdmin){
            done();
        }

        const status = await fastify.prisma.service.findUnique({
            where: {
                name: "payment"
            },
            select: {
                status: true
            }
        });
        if(!status){
            return reply.notFound("Service not found");
        }
        if(!status.status){
            return reply.serviceUnavailable("Service is currently unavailable");
        }
    })

    //Check if balance query is allowed for user
    fastify.decorate('balanceAllowed', async (request: FastifyRequest, reply: FastifyReply, done: any) => {
        if(request.user.isAdmin){
            done();
        }
        
        const status = await fastify.prisma.service.findUnique({
            where: {
                name: "balance"
            },
            select: {
                status: true
            }
        });
        if(!status){
            return reply.notFound("Service not found");
        }
        if(!status.status){
            return reply.serviceUnavailable("Service is currently unavailable");
        }
    })
})
