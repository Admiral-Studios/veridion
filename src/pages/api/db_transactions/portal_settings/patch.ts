import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PATCH') {
      const { value, setting } = req.body as {
        value: Date
        setting: string
      }

      const formattedDate = new Date(value).toISOString().replace('T', ' ').replace('Z', '')

      const query = `UPDATE portal_settings SET value = '${formattedDate}', updated_at = '${formattedDate}' WHERE setting = '${setting}';`

      await ExecuteQuery(query)

      res.status(200).json(req.body)
    } else {
      res.status(405).json({ message: 'Method Not Allowed' })
    }
  } catch (error) {
    res.status(401).json(error)
  }
}
