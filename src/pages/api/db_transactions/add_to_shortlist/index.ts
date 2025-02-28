import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ids, user_id, name } = req.body as { ids: number[]; user_id: number; name: string }

    const insertQuery = ids
      .map(
        id => `INSERT INTO company_shortlists (watchlist_id, user_id, name) VALUES ('${id}', '${user_id}', '${name}');`
      )
      .join('')

    await ExecuteQuery(insertQuery)

    res.status(200).json({})
  } catch (error) {
    res.status(403).json({ message: 'Failed to add shortlist' })
  }
}
