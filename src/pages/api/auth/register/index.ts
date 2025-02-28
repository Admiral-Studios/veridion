import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next/types'
import bcrypt from 'bcrypt'
import sql, { ConnectionPool, Request } from 'mssql'

import { transporter } from 'src/utils/nodemailer'
import { createVerificationEmail } from 'src/utils/mail-templates/emailTemplate'
import { dbConfig } from 'src/configs/db'

const senderAliasEmail = process.env.NEXT_PUBLIC_SENDER_ALIAS_EMAIL
const salesEmail = process.env.NEXT_PUBLIC_SALES_EMAIL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool: ConnectionPool = await sql.connect(dbConfig)
  const request: Request = pool.request()

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

    const query = `SELECT TOP 1 * FROM users WHERE email='${email}'`

    const findUser = (await request.query(query)).recordset

    const password_hash = bcrypt.hashSync(password, 8)

    if (findUser.length) {
      return res.status(200).json({ message: 'This email is already is use' })
    }

    const querySelectVisitorRole = `SELECT id FROM roles WHERE role = 'visitor';`
    const roleResult = await request.query(querySelectVisitorRole)

    const roleId = roleResult.recordset[0].id

    request.input('company', sql.NVarChar, company || '')
    request.input('name', sql.NVarChar, name || '')
    request.input('title', sql.NVarChar, title || '')
    request.input('industry', sql.NVarChar, industryVertical || '')

    const querySave = `INSERT INTO Users (user_name, email, password_hash, company, name, title, is_verified, role_id, industry) VALUES ('${user_name}', '${email}', '${password_hash}', @company, @name, @title, '${false}', '${roleId}', @industry);`
    await request.query(querySave)

    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1d' })

    const magicLink = `${process.env.NEXT_PUBLIC_URL}/verify?token=${token}`

    await transporter.sendMail({
      from: senderAliasEmail,
      to: email,
      bcc: salesEmail,
      subject: 'Verify your account',
      html: createVerificationEmail(email, magicLink)
    })

    res.status(200).json({})
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
