import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    const fetchQuery = `SELECT * FROM product_projects WHERE user_id = '${payload.id}' ORDER BY created_at ASC; `

    const [result] = await ExecuteQuery(fetchQuery)

    res.status(200).json(result)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch product projects' })
  }
}
