import sql, { ConnectionPool, Request, VarChar } from 'mssql'
import { dbConfig } from 'src/configs/db'

export default async function ExecuteQuery(query: string): Promise<any> {
  try {
    const pool: ConnectionPool = await sql.connect(dbConfig)
    const request: Request = pool.request()
    request.input('input_parameter', VarChar, 'value') // Add this line if you have parameters in your query.

    const result = await request.query(query)

    return result.recordsets
  } catch (error) {
    console.error(error)
    throw error
  }
}
