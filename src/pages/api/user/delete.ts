import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body

      if (id) {
        const deleteUserQuery = `DELETE FROM users WHERE id = '${id}'; 
        DELETE FROM user_watchlist WHERE user_id = '${id}'; 
        DELETE FROM user_activity WHERE user_id = '${id}'; 
        `

        await ExecuteQuery(deleteUserQuery)

        res.status(200).json({ id })
      }
    } catch (error) {
      res.status(403).json({ message: 'Failed to delete user' })
    }
  }
}
