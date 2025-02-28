import { NextApiRequest, NextApiResponse } from 'next/types'
import ExecuteQuery from 'src/utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { subject, json_query, messages, id, user_id } = req.body as {
      subject: string
      json_query: string
      messages: string[]
      id: number
      user_id: number
    }

    const insertQuery = `UPDATE user_ai_threads SET subject = '${subject}', json_query = '${json_query}' WHERE id = '${id}'`

    await ExecuteQuery(insertQuery)

    const insertDeleteMessagesQuery = `DELETE FROM ai_thread_messages WHERE thread_id = '${id}'; ${messages
      .map(message => `INSERT INTO ai_thread_messages (thread_id, message) VALUES ('${id}', '${message}');`)
      .join('')}`

    await ExecuteQuery(insertDeleteMessagesQuery)

    res.status(200).json({ subject, json_query, messages, id, user_id })
  } catch (error) {
    res.status(403).json({ message: 'Failed to add thread' })
  }
}
