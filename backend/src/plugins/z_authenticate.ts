import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Static, Type } from '@sinclair/typebox';

declare module 'fastify' {
    interface FastifyInstance {
        verifyAuth: () => Promise<void>,
        isAdmin: () => Promise<void>,
        isOwner: () => Promise<void>,
        isPaymentOwner: () => Promise<void>,
    }
}

//When used in isOwner, id is the id of the user
//When used in isPaymentOwner, id is the id of the paymentMethod
const paramsSchema = Type.Object({
    id: Type.Optional(Type.Number()),
});

const authPlugin = fp(async (fastify, opts) => {
    //Check if user is authenticated
    fastify.decorate('verifyAuth', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    //Check if user is admin
    fastify.decorate('isAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            const id = request.user.id;
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

    //Verifies if the user is admin, if not, makes the params id be the logged user id
    //this is a prehandler for all routes that require admin or owner (like modifying a user)
    fastify.decorate('isOwner', async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            const logged_id = request.user.id;
            const user = await fastify.prisma.user.findUnique({
                where: {
                    id: logged_id,
                },
            });
            if(!user){
                return reply.unauthorized('Invalid user');
            }
            if(!user.isAdmin){
                request.params = { id: logged_id };
            }
        } catch (err) {
            reply.send(err);
        }
    });

    //verify if user is admin or owner of paymentMethod
    fastify.decorate('isPaymentOwner', async (request: FastifyRequest, reply: FastifyReply) => {
        try{
            const logged_id = request.user.id;
            const user = await fastify.prisma.user.findUnique({
                where: {
                    id: logged_id,
                },
            });
            if(!user){
                return reply.unauthorized('Invalid user');
            }
            if(!user.isAdmin){
                const { id } = request.params as Static<typeof paramsSchema>;

                const payment = await fastify.prisma.paymentMethod.findUnique({
                    where: {
                        id: id,
                    },
                    select: {
                        userId: true,
                    }
                });
                if(!payment){
                    return reply.notFound("Payment method not found");
                }

                if(payment.userId != logged_id){
                    reply.unauthorized("You are not authorized to perform this action");
                }
            }
        } catch (err) {
            reply.badRequest();
        }
    });
            
});

export default authPlugin;