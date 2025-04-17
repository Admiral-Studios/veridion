import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, currentDuration, loginAt } = req.body

  try {
    const query = `
      UPDATE user_activity
      SET session_duration = @currentDuration
      WHERE user_id = @userId
      AND login_at = @loginAt;
    `

    await ExecuteQuery(query, {
      currentDuration: currentDuration,
      userId: userId,
      loginAt: loginAt
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error updating session duration:', error)

    return res.status(500).json({ success: false })
  }
}

export default withAuth(handler)
