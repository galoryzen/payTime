import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = async (fastify, opts) => {
    const prisma = new PrismaClient()

    await prisma.$connect()

    fastify.decorate('prisma', prisma)

    fastify.addHook('onClose', async (fastify, done) => {
        await prisma.$disconnect()
        done()
    })
}

export default fp(prismaPlugin)