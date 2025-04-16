import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    const fetchQuery = `
      SELECT *
      FROM user_watchlist
      WHERE user_id = @userId
      AND is_product = '1';
    `

    const [result] = await ExecuteQuery(fetchQuery, {
      userId: payload.id
    })

    const ids = result.map(({ veridion_id }: any) => veridion_id)

    res.status(200).json(ids)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch shortlists' })
  }
}

export default withAuth(handler)
