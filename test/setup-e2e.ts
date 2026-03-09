import { config } from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()
const databaseURL = generateUniqueDatabaseUrl(schemaId)

process.env.DATABASE_URL = databaseURL

const pool = new Pool({ connectionString: databaseURL })
const adapter = new PrismaPg(pool, { schema: schemaId })
const prisma = new PrismaClient({ adapter })

beforeAll(async () => {
  execSync('pnpm prisma migrate deploy', {
    env: {
      ...process.env,
      DATABASE_URL: databaseURL,
    },
  })
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
  await pool.end()
})
