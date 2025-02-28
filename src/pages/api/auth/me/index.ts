import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'

import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let id

  const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.')
  }

  const token = req.cookies.refreshToken

  if (!token) {
    return res.status(403).json({ auth: false, message: 'No token provided' })
  }

  jwt.verify(token, jwtSecret, function (err: any, decoded: any) {
    if (err) {
      return res.status(401).json({ auth: false, message: 'Failed to authenticate token' })
    }
    id = decoded.id
  })

  const query = `SELECT TOP 1 u.*, r.role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id='${id}'`

  const findUser = await ExecuteQuery(query)

  if (!findUser[0].length) {
    return res.status(404).json({ message: 'Invalid email or password' })
  }

  const user = findUser[0][0]

  res.status(200).json({
    userData: {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      apiKey: user.api_key,
      company: user.company,
      name: user.name,
      title: user.title,
      role: user.role,
      role_id: user.role_id,
      industry: user.industry,
      requested_elevanted_access: !!user.requested_elevanted_access
    }
  })
}
