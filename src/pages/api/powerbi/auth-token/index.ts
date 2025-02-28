import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const client_id = process.env.NEXT_PUBLIC_POWER_BI_API_CLIENT_ID || ''
  const client_secret = process.env.NEXT_PUBLIC_POWER_BI_API_CLIENT_SECRET || ''
  const formData = new FormData()

  formData.append('client_id', client_id)
  formData.append('client_secret', client_secret)
  formData.append('grant_type', 'client_credentials')
  formData.append('resource', 'https://analysis.windows.net/powerbi/api')

  const requestOptions = {
    method: 'POST',
    body: formData
  }

  const fetchResponse = await fetch(
    `https://login.windows.net/${process.env.NEXT_PUBLIC_POWER_BI_TENANT_ID}/oauth2/token`,
    requestOptions
  )

  const res = await fetchResponse.json()

  return response.status(200).json(res)
}
