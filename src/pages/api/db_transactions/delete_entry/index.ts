import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.body

    if (id) {
      const deleteQuery = `DELETE FROM user_watchlist WHERE id = @id`

      await ExecuteQuery(deleteQuery, { id })

      res.status(200).json({ id })
    }
  } catch (error) {
    res.status(403).json({ message: 'Failed to delete company' })
  }
}

export default withAuth(handler)
