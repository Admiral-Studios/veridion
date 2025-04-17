import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'
import { createUpdateUserInHubspot } from 'src/utils/hubspot/createUpdateService'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body

      if (id) {
        const deleteUserQuery = `
          DELETE FROM users WHERE id = @id;
          DELETE FROM user_watchlist WHERE user_id = @id;
          DELETE FROM user_activity WHERE user_id = @id;
        `

        await ExecuteQuery(deleteUserQuery, { id })

        const getUserQuery = `SELECT * FROM users WHERE id = @id`
        const userResult = await ExecuteQuery(getUserQuery, { id })
        const [user] = userResult
        user.has_full_access_to_explore = false

        await createUpdateUserInHubspot(user)

        res.status(200).json({ id })
      }
    } catch (error) {
      res.status(403).json({ message: 'Failed to delete user' })
    }
  }
}

export default withAuth(handler)
