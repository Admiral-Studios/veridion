import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user_id } = req.body as { user_id: number }

    const fetchQuery = `
      SELECT tr.*, m.messages 
      FROM user_ai_threads tr
    
      LEFT JOIN
        (
            SELECT
                tm.thread_id,
                STRING_AGG(tm.message, ', ') AS messages
            FROM
                ai_thread_messages tm
            GROUP BY
                tm.thread_id
        ) m ON tr.id = m.thread_id
    
        WHERE tr.user_id = '${user_id}' ORDER BY created_at DESC;`
    const [result] = await ExecuteQuery(fetchQuery)

    const formattedResult = result.map((obj: any) => ({
      ...obj,
      messages: obj?.messages?.length ? obj.messages.split(', ') : []
    }))

    res.status(200).json(formattedResult)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch thread' })
  }
}
