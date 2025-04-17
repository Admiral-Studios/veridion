import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ids, user_id, name } = req.body as { ids: number[]; user_id: number; name: string }

    const insertQuery = ids
      .map(
        id => `
      INSERT INTO company_shortlists (watchlist_id, user_id, name)
      VALUES (@id_${id}, @userId, @name);
    `
      )
      .join('')

    const params = {
      userId: user_id,
      name: name,
      ...ids.reduce((acc: Record<string, number>, id) => {
        acc[`id_${id}`] = id

        return acc
      }, {} as Record<string, number>)
    }

    await ExecuteQuery(insertQuery, params)

    res.status(200).json({})
  } catch (error) {
    res.status(403).json({ message: 'Failed to add shortlist' })
  }
}

export default withAuth(handler)
