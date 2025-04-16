import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const user = req.body as {
      email: string
      username: string
      title: string
      name: string
      company: string
      id: string
      industryVertical: string
      requested_elevanted_access: boolean
    }

    const id = user.id

    if (id) {
      const findUserQuery = `
        SELECT TOP 1 *
        FROM users
        WHERE email = @userEmail;
      `

      const userExists = await ExecuteQuery(findUserQuery, { userEmail: user.email })

      const me = userExists[0].find((dbUser: any) => dbUser.id === +id)

      if (userExists[0].length && !me) {
        return res.status(401).json({ message: 'This email is already in use' })
      }

      const query = `
        UPDATE users
        SET user_name = @username,
            email = @userEmail,
            company = @company,
            name = @name,
            title = @title,
            industry = @industry,
            requested_elevanted_access = @requestedElevatedAccess
        WHERE id = @id;
      `

      const params = {
        username: user.username,
        userEmail: user.email,
        company: user.company,
        name: user.name,
        title: user.title,
        industry: user.industryVertical,
        requestedElevatedAccess: user.requested_elevanted_access,
        id: id
      }

      await ExecuteQuery(query, params)

      res.status(200).json(req.body)
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

export default withAuth(handler)
