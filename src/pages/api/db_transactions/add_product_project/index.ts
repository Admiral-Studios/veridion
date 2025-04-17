import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name } = req.body as { id: number; name: string }
    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    const insertQuery = `
      INSERT INTO product_projects (watchlist_id, user_id, name)
      VALUES (@id, @userId, @name);
      SELECT SCOPE_IDENTITY() AS id;
    `

    const params = {
      id,
      userId: payload.id,
      name
    }

    const [result] = await ExecuteQuery(insertQuery, params)

    res.status(200).json(result[0].id)
  } catch (error) {
    console.log(error)
    res.status(403).json({ message: 'Failed to add project' })
  }
}

export default withAuth(handler)
