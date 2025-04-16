import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next/types'
import bcrypt from 'bcrypt'

import { transporter } from 'src/utils/nodemailer'
import { createVerificationEmail } from 'src/utils/mail-templates/emailTemplate'
import ExecuteQuery from 'src/utils/db'

const senderAliasEmail = process.env.NEXT_PUBLIC_SENDER_ALIAS_EMAIL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables.')
    }

    const { email, user_name, password, company, title, name, industryVertical } = req.body as {
      email: string
      user_name: string
      password: string
      company: string
      title: string
      name: string
      industryVertical: string
    }

    const query = `SELECT TOP 1 * FROM users WHERE email = @email`

    const findUser = await ExecuteQuery(query, { email })

    const password_hash = bcrypt.hashSync(password, 8)

    if (findUser.length) {
      return res.status(200).json({ message: 'This email is already is use' })
    }

    const querySelectVisitorRole = `SELECT id FROM roles WHERE role = @role`
    const roleResult = await ExecuteQuery(querySelectVisitorRole, { role: 'visitor' })

    const roleId = roleResult[0]?.id

    const querySave = `
      INSERT INTO Users (user_name, email, password_hash, company, name, title, is_verified, role_id, industry)
      VALUES (@userName, @email, @passwordHash, @company, @name, @title, @isVerified, @roleId, @industry)
    `

    const params = {
      userName: user_name,
      email: email,
      passwordHash: password_hash,
      company: company || '',
      name: name || '',
      title: title || '',
      isVerified: false,
      roleId: roleId,
      industry: industryVertical || ''
    }

    await ExecuteQuery(querySave, params)

    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1d' })

    const magicLink = `${process.env.NEXT_PUBLIC_URL}/verify?token=${token}`

    await transporter.sendMail({
      from: senderAliasEmail,
      to: email,
      subject: 'Verify your account',
      html: createVerificationEmail(email, magicLink)
    })

    res.status(200).json({})
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
