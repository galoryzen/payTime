import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import { FastifyCookieOptions } from '@fastify/cookie';
import envSchema from 'env-schema';
import { Type, Static } from '@sinclair/typebox';
import fp from 'fastify-plugin';


const schema = Type.Object({
    JWT_SECRET: Type.String({ minLength: 5 }),
})

export default fp<FastifyCookieOptions>(async (fastify, opts) => {
    const { JWT_SECRET: secret } = envSchema({ schema, dotenv:true }) as Static<typeof schema>

    fastify.register(cookie, {
        ... { secret },
    } as FastifyCookieOptions);
})


