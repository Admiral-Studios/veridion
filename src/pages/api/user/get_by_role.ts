import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

interface EmailObject {
  email: string
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { role } = req.query

    if (role) {
      const findUserQuery = `
        SELECT DISTINCT ur.email
        FROM roles r
        INNER JOIN users ur ON r.id = ur.role_id
        WHERE r.role = @role
      `

      const [dbResult] = await ExecuteQuery(findUserQuery, { role })
      const emails: string[] = dbResult.map((obj: EmailObject) => obj.email)

      res.status(200).json(emails)
    }
  } catch (error) {
    res.status(403).json({ message: 'Failed to get users by role' })
  }
}

export default withAuth(handler)
