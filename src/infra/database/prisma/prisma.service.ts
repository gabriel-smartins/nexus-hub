import 'dotenv/config'

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool

  constructor() {
    const connectionString = process.env.DATABASE_URL!

    const schema =
      new URL(connectionString).searchParams.get('schema') ?? 'public'

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool, { schema })

    super({
      adapter,
      log: ['warn', 'error'],
    })

    this.pool = pool
  }
  onModuleInit() {
    return this.$connect()
  }
  async onModuleDestroy() {
    await this.$disconnect()
    await this.pool.end()
  }
}
