import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  let authenticationToken = request.body.authenticationToken

  const { type } = request.query as { type: string }

  if (!authenticationToken) {
    authenticationToken = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/powerbi/auth-token`)
      .then(res => res.json())
      .then(data => data.access_token)
  }

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('Authorization', `Bearer ${authenticationToken}`)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  let reportId = process.env.NEXT_PUBLIC_POWER_BI_REPORT_ID
  switch (type) {
    case 'analytics':
      reportId = process.env.NEXT_PUBLIC_POWER_BI_WATCHLIST_REPORT_ID
      break
    case 'logins':
      reportId = process.env.NEXT_PUBLIC_POWER_BI_LOGINS_REPORT_ID
    default:
      break
  }

  const fetchResponse = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${process.env.NEXT_PUBLIC_POWER_BI_WORKSPACE_ID}/reports/${reportId}?client_id=${process.env.NEXT_PUBLIC_POWER_BI_API_CLIENT_ID}&secret_id=${process.env.NEXT_PUBLIC_POWER_BI_API_CLIENT_SECRET}&resource=https://analysis.windows.net/powerbi/api`,
    requestOptions
  )

  const res = await fetchResponse.json()

  return response.status(200).json(res)
}
