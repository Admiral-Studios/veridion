import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { withAuth } from 'src/pages/api/middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { datagrid } = req.query as { datagrid: string }

    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    const fetchQuery = `
      SELECT TOP 1 *
      FROM user_export_settings
      WHERE user_id = @userId
      AND datagrid = @datagrid;
    `

    const params = {
      userId: payload.id,
      datagrid: datagrid
    }

    const [result] = await ExecuteQuery(fetchQuery, params)
    res.status(200).json(result[0] || null)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch export settings' })
  }
}

export default withAuth(handler)
