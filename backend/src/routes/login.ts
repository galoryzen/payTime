import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import bcrypt from 'bcrypt';

async function routes(fastify: FastifyInstance, options: any){
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    //generate access token
    server.post('/', {
        schema: {
            summary: 'Generate access token',
            tags: ['Auth'],
            body: Type.Object({
                email: Type.String(),
                password: Type.String(),
            }),
            response: {
                200: Type.Object({
                    token: Type.String(),
                }),
                401: Type.Object({
                    message: Type.String(),
                }),
            }
        }
    }, async (request, reply) => {
        const { email, password } = request.body
        const user = await server.prisma.user.findUnique({
            where: {
                email: email
            },
        });
        if (!user) {
            return reply.unauthorized('Invalid email or password');
        }

        const isValid =  await bcrypt.compare(password, user.password);

        if (!isValid) {
            return reply.unauthorized('Invalid email or password');
        }
        const payload = {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        }

        const token = await server.jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    //register
    server.post('/register', {
        schema: {
            summary: 'Register a new user',
            tags: ['Auth'],
            body: Type.Object({
                name: Type.String(),
                email: Type.String(),
                password: Type.String(),
            }),
            response: {
                200: Type.Object({
                    message: Type.String(),
                }),
                401: Type.Object({
                    message: Type.String(),
                }),
            }
        }
    }, async (request, reply) => {
        const { name, email, password } = request.body

        const user = await server.prisma.user.findUnique({
            where: {
                email: email
            },
        });
        if (user) {
            return reply.unauthorized('Email already exists');
        }

        const newUser = await server.prisma.user.create({
            data: {
                name: name,
                email: email,
                password: await bcrypt.hash(password, 10),
            },
        });
        return { message: 'User created successfully' };
    }
}