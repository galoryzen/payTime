import { SwaggerOptions } from '@fastify/swagger';
import fp from 'fastify-plugin';

export default fp<SwaggerOptions>(async (server, options) => {
  server.register(require('@fastify/swagger'), {
    ...options,
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Galoryzen',
        version: '1.0.0',
      },
      schemes: ['http', 'https'],
      tags: [
        { name: 'Bank', description: 'Bank related endpoints' },
        { name: 'Auth', description: 'Login' },
      ],
    },
  })
})
