import { NextApiRequest, NextApiResponse } from 'next/types'
import { createNewSearchTrialAccessTemplate } from 'src/utils/mail-templates/newSearchTrialAccess'

import { transporter } from 'src/utils/nodemailer'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { email, fullName, role } = request.body as {
    email: string
    fullName: string
    role: string
  }

  try {
    await transporter.sendMail({
      from: 'vlad@storiesofdata.com',
      to: process.env.NEXT_PUBLIC_SALES_EMAIL,
      subject: 'Request Trial Access',
      html: createNewSearchTrialAccessTemplate(email, fullName, role)
    })

    return response.status(200).json('Success!')
  } catch (error) {}

  return response.status(400).json('Something went wrong!')
}
