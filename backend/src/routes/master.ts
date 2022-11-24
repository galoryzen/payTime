import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import bcrypt from 'bcrypt';

async function routes(fastify: FastifyInstance, options: any){
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/populate', {
        schema: {
            tags: ['Populate'],
            response: {
                200: Type.Object({
                    message: Type.String(),
                }),
            }
        }
    }, async (request, reply) => {
        //delete all tables
        await server.prisma.transaction.deleteMany();
        await server.prisma.service.deleteMany();
        await server.prisma.paymentMethod.deleteMany();
        await server.prisma.user.deleteMany();
        await server.prisma.bank.deleteMany();

        await server.prisma.service.create({
            data: {
                id: 1,
                name: "query",
                status: true
            }
        });

        await server.prisma.service.create({
            data: {
                id: 2,
                name: "payment",
                status: true
            }
        });

        await server.prisma.service.create({
            data: {
                id: 3,
                name: "balance",
                status: true
            }
        });

        await server.prisma.user.create({
            data: {
                id: 1,
                name: "admin",
                email: "admin@admin.com",
                password: await bcrypt.hash("admin", 10),
                isAdmin: true,
            },
        });

        await server.prisma.user.create({
            data: {
                id: 2,
                name: "user",
                email: "user@user.com",
                password: await bcrypt.hash("user", 10),
                isAdmin: false,
            },
        });
        // create banks
        await server.prisma.bank.create({
            data: {
                id: 1,
                name: "West Bank",
            },
        });
        
        await server.prisma.bank.create({
            data: {
                id: 2,
                name: "East Bank",
            },
        });

        //create payment methods
        await server.prisma.paymentMethod.create({
            data: {
                id: 1,
                name: "Sebastian Gonzalez",
                cardNumber: "371234567890123",
                status: true,
                tipo: "CREDITO",
                provider: "AMEX",
                CVV: "123",
                expiryDate: "2022-06-31",
                bankId: 1,
                balance: 1000000,
                userId: 1,
            },
        });

        await server.prisma.paymentMethod.create({
            data: {
                id: 2,
                name: "Raul Lopez",
                cardNumber: "5123123123123123",
                status: true,
                tipo: "DEBITO",
                provider: "MASTERCARD",
                CVV: "523",
                expiryDate: "2022-12-31",
                bankId: 2,
                balance: 500000,
                userId: 1,
            },
        });

        await server.prisma.paymentMethod.create({
            data: {
                id: 3,
                name: "Juan Perez",
                cardNumber: "4111111111111111",
                status: true,
                tipo: "CREDITO",
                provider: "VISA",
                CVV: "723",
                expiryDate: "2024-06-31",
                bankId: 1,
                balance: 1000000,
                userId: 2,
            },
        });

        return {
            message: "Data populated",
        };
    });
}

export default routes;