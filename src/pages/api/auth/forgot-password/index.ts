import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next/types'

import ExecuteQuery from 'src/utils/db'
import { createForgotTemplate } from 'src/utils/mail-templates/emailTemplate'
import { transporter } from 'src/utils/nodemailer'

const senderAliasEmail = process.env.NEXT_PUBLIC_SENDER_ALIAS_EMAIL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables.')
    }

    const { email } = req.body as {
      email: string
    }

    const query = `SELECT TOP 1 * FROM users WHERE email='${email}'`

    const findUser = await ExecuteQuery(query)

    if (!findUser[0].length) {
      return res.status(403).json({ message: 'Account with this email not found' })
    }

    const token = jwt.sign({ email, id: findUser[0][0].id }, jwtSecret, { expiresIn: '1h' })

    const magicLink = `${req.headers.origin}/recovery?token=${token}`

    await transporter.sendMail({
      from: senderAliasEmail,
      to: email,
      subject: 'Forgot password?',
      html: createForgotTemplate(magicLink)
    })

    res.status(200).json({})
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
