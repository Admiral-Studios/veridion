import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import sql, { ConnectionPool, NVarChar, Request } from 'mssql'

import { searchApiUrl } from 'src/configs/api'
import { dbConfig } from 'src/configs/db'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const keyFromHeaders = request.headers.authorization || ''

  const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.')
  }
  const payload = keyFromHeaders ? (jwt.decode(keyFromHeaders) as { apiKey: string }) : null

  if (!payload?.apiKey) {
    return response.status(401).json({ message: 'API Key not provided' })
  }

  const apiKey = payload?.apiKey || ''

  const validationQueryHeaders = new Headers()
  validationQueryHeaders.append('Content-Type', 'application/json')
  validationQueryHeaders.append('x-api-key', apiKey)

  const validationResponse = await fetch(`${searchApiUrl}/companies?page_size=1`, {
    method: 'POST',
    headers: validationQueryHeaders
  })

  const validationData = await validationResponse.json()

  if (validationData.status === 401) {
    return response.status(400).json({ message: 'Invalid API Key, please, try again' })
  }

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('X-Api-Key', process.env.NEXT_PUBLIC_THREAD_API_KEY || '')

  const { history, query, userId } = request.body as { query: string; userId: number; history: string[] }

  const raw: { message: string; history?: string[] } = {
    message: query
  }

  if (!!history.length) {
    raw.history = history
  }

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: 'follow' as RequestRedirect
  }

  try {
    const res = await fetch(
      `https://w3cshvdsxh34737ixakld2xtt40wszpv.lambda-url.us-east-1.on.aws/query`,
      requestOptions
    )

    const result = await res.text()

    const pool: ConnectionPool = await sql.connect(dbConfig)
    const request: Request = pool.request()

    request.input('ai_generated_json', NVarChar, query)
    request.input('prompt_for_ai', NVarChar, result)

    const updateAiAgentQuery = `INSERT INTO ai_agent_data (user_id, ai_generated_json, prompt_for_ai) VALUES ('${userId}', @ai_generated_json, @prompt_for_ai);`
    await request.query(updateAiAgentQuery)

    response.status(200).json({ result: result })
  } catch (error) {
    response.status(400).json(error)
  }
}
