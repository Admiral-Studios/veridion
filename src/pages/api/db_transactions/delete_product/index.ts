import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.body

    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    if (id) {
      const deleteQuery = `DELETE FROM user_watchlist WHERE veridion_id = '${id}' AND user_id = '${payload.id}' AND is_product = '1' ;`

      await ExecuteQuery(deleteQuery)

      res.status(200).json({ id })
    }
  } catch (error) {
    res.status(403).json({ message: 'Failed to delete product' })
  }
}
