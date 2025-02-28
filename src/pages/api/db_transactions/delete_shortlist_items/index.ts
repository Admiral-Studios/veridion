import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user_id, name, ids } = req.body

    if (user_id && name) {
      const deleteQuery = ids.map(
        (id: number) =>
          `DELETE FROM company_shortlists WHERE name = '${name}' AND user_id = '${user_id}' AND watchlist_id = '${id}';`
      )

      await ExecuteQuery(deleteQuery)

      res.status(200).json({})
    }
  } catch (error) {
    res.status(403).json({ message: 'Failed to delete shortlist group' })
  }
}
