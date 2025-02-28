import { NextApiRequest, NextApiResponse } from 'next/types'
import sql, { ConnectionPool, Request } from 'mssql'
import { dbConfig } from 'src/configs/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool: ConnectionPool = await sql.connect(dbConfig)
  const request: Request = pool.request()

  if (req.method === 'PATCH') {
    const { settingsId, definedColumn } = req.body as {
      settingsId: string
      definedColumn: string
    }

    request.input('definedColumn', sql.NVarChar, definedColumn) // Add this line if you have parameters in your query.

    const query = `UPDATE user_export_settings SET user_defined_column = @definedColumn WHERE id = '${settingsId}';`

    await request.query(query)

    res.status(200).json(req.body)
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
