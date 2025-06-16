import { PrismaClient } from '@prisma/client/client'

// singleton instance of PrismaClient
export const prisma = new PrismaClient()