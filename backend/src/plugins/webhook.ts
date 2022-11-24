import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import fp from 'fastify-plugin';

declare module 'fastify' {
    interface FastifyInstance {
        stashRequest: () => Promise<void>,
        processPending: () => Promise<void>,
        testError: () => Promise<void>,
    }
}

const bodySchema = Type.Object({
    amount: Type.Number(),
    description: Type.String(),
    userId: Type.Optional(Type.Number()),
    paymentMethodId: Type.Number(),
});

export default fp (async (fastify, opts) => {
    fastify.decorate('stashRequest', async (request: FastifyRequest, reply: FastifyReply, done: any) => {
        const body = request.body as Static<typeof bodySchema>;
        
        if (!request.user.isAdmin) {
            body.userId = request.user.id;
        }

        //if body.userId return badrequest
        if (!body.userId) {
            return reply.badRequest("Admin forgot to add userId");
        }

        //verify if paymentMethod exists
        const paymentMethod = await fastify.prisma.paymentMethod.findUnique({
            where: {
                id: Number(body.paymentMethodId),
            },
        });

        if (!paymentMethod) {
            return reply.notFound("Payment method not found");
        }

        const transaction = await fastify.prisma.transaction.create({
            data: {
                amount: body.amount,
                description: body.description,
                user : {
                    connect: {
                        id: body.userId,
                    },
                },
                paymentMethod: {
                    connect: {
                        id: body.paymentMethodId,
                    },
                },
            },
        });

        request.body = {
            ...body,
            id: transaction.id,
        };
    })

    //function to process all pending transactions
    fastify.decorate('processPending', async (request: FastifyRequest, reply: FastifyReply) => {
        console.log("Processing pending transactions");

        const pendingTransactions = await fastify.prisma.transaction.findMany({
            where: {
                status: "Pendiente",
            },
        });

        for (const transaction of pendingTransactions) {
            const user = await fastify.prisma.user.findUnique({
                where: {
                    id: transaction.userId,
                },
            });

            if (!user) {
                continue
            }

            const paymentMethod = await fastify.prisma.paymentMethod.findUnique({
                where: {
                    id: transaction.paymentMethodId,
                },
            });

            if (!paymentMethod) {
                continue
            }

            if (!paymentMethod.status) {
                //create transaction as failed
                await fastify.prisma.transaction.update({
                    where: {
                        id: transaction.id,
                    },
                    data: {
                        status: "Rejected, payment method is disabled",
                    },
                });
                continue
            }

            if (paymentMethod.balance < transaction.amount) {
                //create transaction as failed
                await fastify.prisma.transaction.update({
                    where: {
                        id: transaction.id,
                    },
                    data: {
                        status: "Rejected, payment method has insufficient balance",
                    },
                });
                continue
            }

            //if everything ok, create transaction as success and update payment method balance
            await fastify.prisma.transaction.update({
                where: {
                    id: transaction.id,
                },
                data: {
                    status: "Approved",
                },
            });

            await fastify.prisma.paymentMethod.update({
                where: {
                    id: transaction.paymentMethodId,
                },
                data: {
                    balance: {
                        decrement: transaction.amount,
                    },
                },
            });
        }
    })

    fastify.decorate('testError', async () => {
        throw new Error('test error');
    })
});