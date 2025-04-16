import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, clickedOn } = req.body

  try {
    const clickedAt = new Date().toISOString().replace('T', ' ').replace('Z', '')

    const query = `
      INSERT INTO user_click_activity (user_id, clicked_on, clicked_at)
      VALUES (@userId, @clickedOn, @clickedAt);
    `

    const params = {
      userId: userId,
      clickedOn: clickedOn,
      clickedAt: clickedAt
    }

    await ExecuteQuery(query, params)

    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(403).json({ success: false, error })
  }
}

export default withAuth(handler)
