import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaPg } from '@prisma/adapter-pg'

export default async function () {
  const schemaId = randomUUID()

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)

  const databaseURL = url.toString()
  process.env.DATABASE_URL = databaseURL

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseURL }),
  })

  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaId}"`)

  execSync('pnpm prisma migrate deploy')

  return async () => {
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
    )
    await prisma.$disconnect()
  }
}
