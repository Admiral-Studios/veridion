import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from 'src/pages/api/middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { settingsId, definedColumn } = req.body as {
      settingsId: string
      definedColumn: string
    }

    const query = `
        UPDATE user_export_settings
        SET user_defined_column = @definedColumn
        WHERE id = @settingsId;
      `

    await ExecuteQuery(query, {
      definedColumn: definedColumn,
      settingsId: settingsId
    })

    res.status(200).json(req.body)
  } catch (error) {
    res.status(403).json({ message: 'Failed to update export settings' })
  }
}

export default withAuth(handler)
