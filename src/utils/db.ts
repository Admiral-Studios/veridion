import sql, { ConnectionPool, Request } from 'mssql'
import { dbConfig } from 'src/configs/db'

export default async function ExecuteQuery(query: string, params: Record<string, any> = {}): Promise<any> {
  const pool: ConnectionPool = await sql.connect(dbConfig)
  try {
    const request: Request = pool.request()

    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })

    const result = await request.query(query)

    return result.recordsets
  } catch (error) {
    console.error(error)
    throw error
  }
}
