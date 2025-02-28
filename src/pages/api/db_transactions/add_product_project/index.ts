import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name } = req.body as { id: number; name: string }
    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    const insertQuery = `INSERT INTO product_projects (watchlist_id, user_id, name) VALUES ('${id}', '${payload.id}', '${name}'); SELECT SCOPE_IDENTITY() AS id;`

    const [result] = await ExecuteQuery(insertQuery)

    res.status(200).json(result[0].id)
  } catch (error) {
    console.log(error)
    res.status(403).json({ message: 'Failed to add project' })
  }
}
