import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.body

    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    if (id) {
      const deleteQuery = `
      DELETE FROM user_watchlist
      WHERE veridion_id = @veridionId
      AND user_id = @userId
      AND is_product = '1'
    `

      await ExecuteQuery(deleteQuery, {
        veridionId: id,
        userId: payload.id
      })

      res.status(200).json({ id })
    }
  } catch (error) {
    res.status(403).json({ message: 'Failed to delete product' })
  }
}

export default withAuth(handler)
