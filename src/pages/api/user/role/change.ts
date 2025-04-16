import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const { role_id, id } = req.body as {
      role_id: number
      id: number
    }

    const query = `
      UPDATE users
      SET role_id = @role_id
      WHERE id = @id;
    `

    await ExecuteQuery(query, {
      role_id,
      id
    })

    res.status(200).json(req.body)
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

export default withAuth(handler)
