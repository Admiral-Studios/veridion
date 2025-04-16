import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { withAuth } from 'src/pages/api/middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { definedColumn, datagridName } = req.body as {
    definedColumn: string
    datagridName: string
  }

  const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

  const query = `
      INSERT INTO user_export_settings (user_id, datagrid, user_defined_column)
      VALUES (@userId, @datagrid, @definedColumn);
      SELECT SCOPE_IDENTITY() AS id;
    `

  const params = {
    userId: payload.id,
    datagrid: datagridName,
    definedColumn: definedColumn
  }

  const [result] = await ExecuteQuery(query, params)

  res.status(200).json({
    id: result.id,
    user_id: payload.id,
    datagrid: datagridName,
    user_defined_column: definedColumn
  })
}

export default withAuth(handler)
