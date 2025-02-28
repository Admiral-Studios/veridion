import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import ExecuteQuery from 'src/utils/db'
import { verifyHubSpotEmail } from 'src/utils/verifyHubSpotEmails'
import { createUpdateUserInHubspot } from 'src/utils/hubspot/createUpdateService'
import { createWelcomeTemplate } from 'src/utils/mail-templates/welcomeEmailTemplate'
import { transporter } from 'src/utils/nodemailer'

const senderAliasEmail = process.env.NEXT_PUBLIC_SENDER_ALIAS_EMAIL
const salesEmail = process.env.NEXT_PUBLIC_SALES_EMAIL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body

  const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.')
  }

  if (!token) {
    return res.status(403).json({ isVerified: false, message: 'No token provided!' })
  }

  const payload = jwt.decode(token) as { email: string }

  const email = payload.email

  jwt.verify(token, jwtSecret, function (err: any) {
    if (err) {
      return res.status(401).json({ isVerified: false, message: 'Verification token is expired!', email })
    }
  })

  const getUserQuery = `SELECT TOP 1 u.*, r.role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email='${email}'`
  const findUser = await ExecuteQuery(getUserQuery)
  const currentUser = findUser[0][0]

  if (!currentUser.is_verified) {
    const query = `UPDATE users SET is_verified = '${true}' WHERE email = '${email}';`

    await ExecuteQuery(query)

    await transporter.sendMail({
      from: senderAliasEmail,
      to: currentUser.email,
      bcc: salesEmail,
      subject: 'Welcome to Explore Veridion',
      html: createWelcomeTemplate(currentUser.name)
    })

    if (verifyHubSpotEmail(currentUser.email)) {
      await createUpdateUserInHubspot(currentUser)
    }
  }

  return res.status(200).json({ isVerified: true, message: `${email} email successfully verified!`, email })
}
