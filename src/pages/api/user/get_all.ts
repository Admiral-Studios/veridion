import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const findUserQuery = `SELECT * FROM users`

    const dbResult = await ExecuteQuery(findUserQuery)
    const [innerArray] = dbResult

    res.status(200).json(innerArray)
  } catch (error) {
    res.status(403).json({ message: 'Failed to get users by role' })
  }
}
