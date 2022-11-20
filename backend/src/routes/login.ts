import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import bcrypt from 'bcrypt';

async function routes(fastify: FastifyInstance, options: any) {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    //generate access token
    server.post('/login', {
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

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return reply.unauthorized('Invalid email or password');
        }
        const payload = {
            "id": user.id,
            "email": user.email,
            "isAdmin": user.isAdmin,
        }
        const token = server.jwt.sign(payload);
        return { token };
    });
}

export default routes;