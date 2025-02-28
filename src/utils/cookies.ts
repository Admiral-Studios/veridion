import { serialize, parse, CookieSerializeOptions } from 'cookie'
import { NextApiResponse } from 'next/types'

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: string | Record<string, unknown>,
  options: CookieSerializeOptions
) {
  const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if ('maxAge' in options) {
    if (options.maxAge) {
      options.expires = new Date(Date.now() + options.maxAge)
    }
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options))
}

export function parseCookies(req: { headers: { cookie: string } }) {
  return parse(req.headers.cookie || '')
}

export const serializeCookie = (name: string, value: string, options = {}) => {
  return serialize(name, value, {
    httpOnly: true, // Set the cookie as HttpOnly
    secure: process.env.NODE_ENV === 'production', // Only send in production
    sameSite: 'strict', // Adjust as needed
    ...options
  })
}
