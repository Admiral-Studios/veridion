import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    const fetchQuery = `
      SELECT *
      FROM product_projects
      WHERE user_id = @userId
      ORDER BY created_at ASC;
    `

    const [result] = await ExecuteQuery(fetchQuery, {
      userId: payload.id
    })

    res.status(200).json(result)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch product projects' })
  }
}

export default withAuth(handler)
