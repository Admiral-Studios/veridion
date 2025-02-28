import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user_id } = req.query as { user_id: string }

    const fetchQuery = `SELECT * FROM company_shortlists WHERE user_id = '${user_id}';`

    const [result] = await ExecuteQuery(fetchQuery)

    const shortlistsDto = result.reduce((acc: any, curr: any) => {
      if (acc[curr.name]) {
        acc[curr.name] = [...acc[curr.name], curr.watchlist_id]
      } else {
        acc[curr.name] = [curr.watchlist_id]
      }

      return acc
    }, {})

    const formattedShortlists = Object.entries(shortlistsDto).map(([name, ids], key) => ({
      id: key,
      name,
      companies: ids,
      user_id: +user_id
    }))

    res.status(200).json(formattedShortlists)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch shortlists' })
  }
}
