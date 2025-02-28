import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, ids } = req.body as { name: string; ids: string[] }

    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    if (name) {
      let deleteQuery = `DELETE FROM product_projects WHERE name = '${name}' AND user_id = '${payload.id}';`

      ids.forEach(
        id =>
          (deleteQuery += `DELETE FROM user_watchlist WHERE veridion_id = '${id}' AND user_id = '${payload.id}' AND is_product = '1' ;`)
      )

      await ExecuteQuery(deleteQuery)

      res.status(200).json({ name })
    }
  } catch (error) {
    res.status(403).json({ message: 'Failed to delete product' })
  }
}
