import { NextApiRequest, NextApiResponse } from 'next/types'
import { Validator } from 'jsonschema'
import jwt from 'jsonwebtoken'
import { matchApiUrl } from 'src/configs/api'

const matchEnrichSchema = {
  type: 'object',
  properties: {
    legal_names: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    commercial_names: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    address_txt: {
      type: 'string'
    },
    phone_number: {
      type: 'string'
    },
    website: {
      type: 'string'
    },
    registry_id: {
      type: 'string'
    }
  },
  required: ['legal_names', 'commercial_names', 'address_txt', 'phone_number', 'website']
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const keyFromHeaders = request.headers.authorization || ''

  const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET

  const { legal_names, commercial_names, address_txt, phone_number, website, registry_id } = request.body

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.')
  }
  const payload = keyFromHeaders ? (jwt.decode(keyFromHeaders) as { apiKey: string }) : null

  if (!payload?.apiKey) {
    return response.status(401).json({ message: 'API Key not provided' })
  }

  jwt.verify(keyFromHeaders, jwtSecret, function (err: any) {
    if (err) {
      return response.status(401).json({ message: 'Token is expired!', payload, isValid: false })
    }
  })

  const apiKey = payload?.apiKey || ''

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('x-api-key', apiKey)

  const v = new Validator()
  const validatedJSON = v.validate(request.body, matchEnrichSchema)

  if (!validatedJSON.valid) {
    response.status(400).json(validatedJSON.errors)

    return
  }

  const body = JSON.stringify({
    identifiers: {
      legal_names: legal_names,
      commercial_names: commercial_names,
      address_txt: address_txt,
      phone_number: phone_number,
      website: website,
      registry_id: registry_id
    }
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: body
  }

  const fetchResponse = await fetch(`${matchApiUrl}/companies`, requestOptions)

  if (fetchResponse.status === 202) {
    return response.status(404).json({ message: 'Not enriched' })
  }

  const res = await fetchResponse.json()
  response.status(200).json(res)
}
