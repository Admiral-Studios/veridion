import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, user_id } = req.body as { id: string; user_id: number }

    const deleteQuery = `
      DELETE FROM user_ai_threads
      WHERE id = @id
      AND user_id = @userId;
    `

    await ExecuteQuery(deleteQuery, {
      id: id,
      userId: user_id
    })

    res.status(200).json({})
  } catch (error) {
    res.status(403).json({ message: 'Failed to delete thread' })
  }
}

export default withAuth(handler)
