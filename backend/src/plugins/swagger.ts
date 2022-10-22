import { SwaggerOptions } from '@fastify/swagger';
import fp from 'fastify-plugin';

export default fp<SwaggerOptions>(async (server, options) => {
  server.register(require('@fastify/swagger'), {
    ...options,
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Galoryzen',
        version: '1.0.0',
      },
      schemes: ['http', 'https'],
      tags: [
        { name: 'Auth', description: 'Login, generación de Token' },
        { name: 'Example', description: 'Examples' },
      ],
      securityDefinitions: {
        jwt: {
          description: 'JWT Token en el header Authentication, en el formato `Bearer ${jwt}`',
          name: 'Authorization',
          type: 'apiKey',
          in: 'header',
        }
      }
    },
  })
})
