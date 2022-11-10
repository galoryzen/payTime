import Fastify from 'fastify';
import autoLoad from '@fastify/autoload'
import '@fastify/sensible'
import path from 'path';
import fastifyJwt from '@fastify/jwt';

async function main() {
const fastify = Fastify({ logger: true });

    fastify.register(require('@fastify/auth'));

    fastify.register(require('@fastify/sensible'));

    await fastify.register(autoLoad, {
        dir: path.join(__dirname, 'plugins')
    });

    await fastify.register(autoLoad, {
        dir: path.join(__dirname, 'routes')
    });

    fastify.listen({ port: 3000 }, function (err: any, address: any) {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fastify.log.info(`server listening on ${address}`);
    });
}
main()