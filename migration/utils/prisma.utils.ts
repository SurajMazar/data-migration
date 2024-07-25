import {PrismaClient} from "@prisma/client";

/**
 * V3 DB CONNECTION
 */
export const dv3Connection = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_V3_URL
        }
    }
})

/**
 * V4 DB CONNECTION
 */
export const dv4Connection = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_V4_URL
        }
    }
})
