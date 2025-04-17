import { NextApiRequest, NextApiResponse } from 'next/types'
import { createNewFeaturesTemplate } from 'src/utils/mail-templates/new-features-template'

import { transporter } from 'src/utils/nodemailer'
import { withAuth } from '../../middleware/authMiddleware'

const senderAliasEmail = process.env.NEXT_PUBLIC_SENDER_ALIAS_EMAIL

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { email } = request.body as { email: string }

  try {
    await transporter.sendMail({
      from: senderAliasEmail,
      to: email,
      subject: 'Full Explore Veridion Portal - Unlocked',
      html: createNewFeaturesTemplate()
    })

    return response.status(200).json('Success!')
  } catch (error) {}

  return response.status(400).json('Something went wrong!')
}

export default withAuth(handler)
