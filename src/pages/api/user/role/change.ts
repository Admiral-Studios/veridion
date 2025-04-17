import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'
import { createUpdateUserInHubspot } from 'src/utils/hubspot/createUpdateService'

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

    const getUserQuery = `SELECT * FROM users WHERE id = @id`
    const userResult = await ExecuteQuery(getUserQuery, { id })
    const [user] = userResult

    if (role_id > 50) {
      user.has_full_access_to_explore = true
      await createUpdateUserInHubspot(user)
    } else {
      user.has_full_access_to_explore = false
      await createUpdateUserInHubspot(user)
    }

    res.status(200).json(req.body)
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

export default withAuth(handler)
