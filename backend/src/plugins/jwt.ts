import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';
import jwt, { FastifyJWTOptions } from '@fastify/jwt';
import fp from 'fastify-plugin';

const schema = Type.Object({
    JWT_SECRET: Type.String({ minLength: 5 }),
})

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            "id": number;
            "email": string;
            "isAdmin": boolean;
        }
    }
}

export default fp<FastifyJWTOptions>(async (fastify, opts) => {
    const { JWT_SECRET: secret } = envSchema({ schema, dotenv:true }) as Static<typeof schema>
    fastify.register(jwt, { ... opts, ...{ secret } })
})