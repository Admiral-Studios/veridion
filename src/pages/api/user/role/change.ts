import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const { role_id, id } = req.body as {
      role_id: number
      id: number
    }

    const query = `UPDATE users SET role_id = '${role_id}' WHERE id = '${id}';`

    await ExecuteQuery(query)

    res.status(200).json(req.body)
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
