import { NextApiRequest, NextApiResponse } from 'next/types'
import { createUnlockTemplateForSales } from 'src/utils/mail-templates/unlockEmailTemnplateForSales'
import { createUnlockTemplate } from 'src/utils/mail-templates/unlockEmailTemplate'

import { transporter } from 'src/utils/nodemailer'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { email } = request.body as { email: string }

  try {
    await transporter.sendMail({
      from: 'vlad@storiesofdata.com',
      to: process.env.NEXT_PUBLIC_SALES_EMAIL,
      subject: 'Unlock all features',
      html: createUnlockTemplateForSales(email)
    })

    await transporter.sendMail({
      from: 'vlad@storiesofdata.com',
      to: email,
      subject: 'Veridion - Unlock the Full Portal',
      html: createUnlockTemplate()
    })

    return response.status(200).json('Success!')
  } catch (error) {}

  return response.status(400).json('Something went wrong!')
}
