import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, ids } = req.body as { name: string; ids: string[] }

    const payload = (await jwt.decode(req.cookies.accessToken as string)) as { email: string; id: number }

    if (name) {
      let deleteQuery = `
        DELETE FROM product_projects
        WHERE name = @name
        AND user_id = @userId;
      `

      const params: { name: string; userId: number; [key: string]: string | number } = {
        name,
        userId: payload.id
      }

      ids.forEach(
        id =>
          (deleteQuery += `
            DELETE FROM user_watchlist
            WHERE veridion_id = @id_${id}
            AND user_id = @userId
            AND is_product = '1';
          `)
      )

      ids.forEach(id => {
        params[`id_${id}`] = id
      })

      await ExecuteQuery(deleteQuery, params)

      res.status(200).json({ name })
    }
  } catch (error) {
    res.status(403).json({ message: 'Failed to delete product' })
  }
}

export default withAuth(handler)
