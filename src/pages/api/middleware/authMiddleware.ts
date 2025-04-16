import { NextApiRequest, NextApiResponse } from 'next/types'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { serializeCookie } from 'src/utils/cookies'

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: number
}

type NextApiHandler = (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void> | void

export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      const accessToken = req.cookies.accessToken
      const refreshToken = req.cookies.refreshToken

      if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: 'Authentication required' })
      }

      const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in the environment variables.')
      }

      let userId: number | undefined = undefined

      try {
        if (accessToken) {
          try {
            const decoded = jwt.verify(accessToken, jwtSecret) as JwtPayload
            userId = typeof decoded.id === 'number' ? decoded.id : parseInt(decoded.id, 10)
          } catch (error) {
            if (!refreshToken) {
              return res.status(401).json({ message: 'Invalid or expired token' })
            }

            const decoded = jwt.verify(refreshToken, jwtSecret) as JwtPayload
            userId = typeof decoded.id === 'number' ? decoded.id : parseInt(decoded.id, 10)

            const newAccessToken = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '15m' })

            const accessCookie = serializeCookie('accessToken', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 900000,
              path: '/'
            })

            res.setHeader('Set-Cookie', accessCookie)
          }
        } else if (refreshToken) {
          const decoded = jwt.verify(refreshToken, jwtSecret) as JwtPayload
          userId = typeof decoded.id === 'number' ? decoded.id : parseInt(decoded.id, 10)

          const newAccessToken = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '15m' })

          const accessCookie = serializeCookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 900000,
            path: '/'
          })

          res.setHeader('Set-Cookie', accessCookie)
        }
      } catch (error) {
        console.error('Token verification error:', error)

        return res.status(401).json({ message: 'Invalid or expired token' })
      }

      if (userId === undefined) {
        return res.status(401).json({ message: 'Failed to extract user ID from token' })
      }

      req.userId = userId

      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)

      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
