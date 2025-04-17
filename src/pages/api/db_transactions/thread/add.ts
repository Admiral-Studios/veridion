import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { subject, user_id, json_query, messages } = req.body as {
      subject: string
      user_id: number
      json_query: string
      messages: string[]
    }

    const insertQuery = `
      INSERT INTO user_ai_threads (subject, user_id, json_query)
      VALUES (@subject, @userId, @json_query);
      SELECT SCOPE_IDENTITY() AS id;
    `

    const params = {
      subject: subject,
      userId: user_id,
      json_query: json_query
    }

    const [result] = await ExecuteQuery(insertQuery, params)

    const insertMessagesQuery = messages
      .map((message, id) => {
        return `
          INSERT INTO ai_thread_messages (thread_id, message)
          VALUES (@threadId, @message_${id});
        `
      })
      .join('')

    const messageParams = messages.reduce<Record<string, string | number>>((acc, message, id) => {
      acc[`message_${id}`] = message
      acc['threadId'] = result.id

      return acc
    }, {})

    await ExecuteQuery(insertMessagesQuery, messageParams)

    res.status(200).json({ id: result.id })
  } catch (error) {
    res.status(403).json({ message: 'Failed to add thread' })
  }
}

export default withAuth(handler)
