import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { type } = request.query as { type: string }

  const authenticationToken = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/powerbi/auth-token`)
    .then(res => res.json())
    .then(data => data.access_token)

  const reportToken = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/powerbi/report-token?type=${type}`, {
    method: 'POST',
    body: JSON.stringify({ authenticationToken })
  })
    .then(res => res.json())
    .then(data => data.token)

  const embedUrl = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/powerbi/embed-url?type=${type}`, {
    method: 'POST',
    body: JSON.stringify({ authenticationToken })
  })
    .then(res => res.json())
    .then(data => data.embedUrl)

  response.status(200).json({
    reportToken,
    embedUrl
  })
}
