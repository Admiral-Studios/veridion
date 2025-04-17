import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user_id, name, ids } = req.body

    if (user_id && name) {
      const deleteQuery = ids
        .map(
          (id: number) => `
          DELETE FROM company_shortlists
          WHERE name = @name
          AND user_id = @userId
          AND watchlist_id = @id_${id};
        `
        )
        .join('')

      interface Params {
        name: string
        userId: number
        [key: string]: string | number
      }

      const params: Params = {
        name,
        userId: user_id,
        ...ids.reduce((acc: Record<string, number>, id: number) => {
          acc[`id_${id}`] = id

          return acc
        }, {})
      }

      await ExecuteQuery(deleteQuery, params)

      res.status(200).json({})
    }
  } catch (error) {
    res.status(403).json({ message: 'Failed to delete shortlist group' })
  }
}

export default withAuth(handler)
