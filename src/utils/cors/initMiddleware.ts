import { NextApiRequest, NextApiResponse } from 'next/types'

// eslint-disable-next-line @typescript-eslint/ban-types
export default function initMiddleware(middleware: Function) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }

        return resolve(result)
      })
    })
}
