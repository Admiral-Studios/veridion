import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { transporter } from 'src/utils/nodemailer'
import { createVerificationEmail } from 'src/utils/mail-templates/emailTemplate'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body

  const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.')
  }

  if (!email) {
    return res.status(403).json({ message: 'No email provided!' })
  }

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1d' })

  const magicLink = `${req.headers.origin}/verify?token=${token}`

  await transporter.sendMail({
    from: 'Veridion Data Discovery Platform',
    to: email,
    subject: 'Verify your account',
    html: createVerificationEmail(email, magicLink)
  })

  return res.status(200).json({})
}
