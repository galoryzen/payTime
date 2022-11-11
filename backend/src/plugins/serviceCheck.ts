import jwt, { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
//import Type
import { Type, Static } from '@sinclair/typebox';
import prisma from './prisma';

declare module 'fastify' {
    interface FastifyInstance {
        queryAllowed: () => Promise<void>,
        paymentAllowed: () => Promise<void>,
        balanceAllowed: () => Promise<void>,
    }
}

//params schema
const paramsSchema = Type.Object({
    id: Type.Number(),
});

export default fp(async (fastify, opts) => { 
    //Check if query is allowed for user   
    fastify.decorate('queryAllowed', async (request: FastifyRequest, reply: FastifyReply) => {
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
            reply.unauthorized("Service is not available")
        }
    })

    //Check if payment is allowed for user
    fastify.decorate('paymentAllowed', async (request: FastifyRequest, reply: FastifyReply) => {
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
            reply.unauthorized("Service is not available")
        }
    })

    //Check if balance query is allowed for user
    fastify.decorate('balanceAllowed', async (request: FastifyRequest, reply: FastifyReply) => {
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
            reply.unauthorized("Service is not available")
        }
    })
})
