import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { datagrid } = req.query as { datagrid: string }

    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    const fetchQuery = `SELECT TOP 1 * FROM user_export_settings WHERE user_id='${payload.id}' AND datagrid='${datagrid}';`

    const [result] = await ExecuteQuery(fetchQuery)

    res.status(200).json(result[0] || null)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch export settings' })
  }
}
