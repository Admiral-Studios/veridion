import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt from 'jsonwebtoken'
import { searchApiUrl } from 'src/configs/api'
import { withAuth } from '../../middleware/authMiddleware'

export const config = {
  api: {
    responseLimit: false
  }
}

async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { pagination_token, page_size } = request.query

    const jsonBody = request.body.filters

    const myHeaders = new Headers()

    const keyFromHeaders = request.headers.authorization || ''

    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables.')
    }
    const payload = keyFromHeaders ? (jwt.decode(keyFromHeaders) as { apiKey: string }) : null

    if (!payload?.apiKey) {
      return response.status(401).json({ message: 'Activation Key not provided' })
    }

    const apiKey = payload?.apiKey || ''

    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('x-api-key', apiKey)

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: jsonBody
    }

    const fetchResponse = await fetch(
      `${searchApiUrl}/companies?page_size=${page_size || 200}&${
        pagination_token ? `&pagination_token=${pagination_token}` : ''
      }`,
      requestOptions
    )

    const data = await fetchResponse.json()

    if (data?.error) {
      return response.status(400).json({ message: data?.message })
    }

    return response.status(200).json(data)
  } catch (error) {
    return response.status(400).json({ message: 'Company Search Failed' })
  }
}

export default withAuth(handler)
