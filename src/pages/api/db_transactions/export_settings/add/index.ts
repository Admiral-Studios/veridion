import { NextApiRequest, NextApiResponse } from 'next/types'
import sql, { ConnectionPool, Request } from 'mssql'
import { dbConfig } from 'src/configs/db'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool: ConnectionPool = await sql.connect(dbConfig)
  const request: Request = pool.request()

  if (req.method === 'POST') {
    const { definedColumn, datagridName } = req.body as {
      definedColumn: string
      datagridName: string
    }

    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    request.input('definedColumn', sql.NVarChar, definedColumn) // Add this line if you have parameters in your query.

    const query = `INSERT INTO user_export_settings (user_id, datagrid, user_defined_column) VALUES ('${payload.id}', '${datagridName}', @definedColumn); SELECT SCOPE_IDENTITY() AS id;`

    const result = await request.query(query)

    res.status(200).json({
      id: result.recordset[0].id,
      user_id: payload.id,
      datagrid: datagridName,
      user_defined_column: definedColumn
    })
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
