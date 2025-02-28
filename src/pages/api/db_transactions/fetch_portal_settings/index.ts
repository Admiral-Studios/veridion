import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fetchQuery = `SELECT * FROM portal_settings;`

    const [result] = await ExecuteQuery(fetchQuery)

    res.status(200).json(result)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch portal settings' })
  }
}
