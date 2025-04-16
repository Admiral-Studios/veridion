import { NextApiRequest, NextApiResponse } from 'next/types'
import { withAuth } from '../../middleware/authMiddleware'
import ExecuteQuery from 'src/utils/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { subject, json_query, messages, id, user_id } = req.body as {
      subject: string
      json_query: string
      messages: string[]
      id: number
      user_id: number
    }

    const updateQuery = `
      UPDATE user_ai_threads
      SET subject = @subject, json_query = @json_query
      WHERE id = @id;
    `

    const updateParams = {
      subject: subject,
      json_query: json_query,
      id: id
    }

    await ExecuteQuery(updateQuery, updateParams)

    const deleteMessagesQuery = `
      DELETE FROM ai_thread_messages WHERE thread_id = @id;
    `

    await ExecuteQuery(deleteMessagesQuery, { id })

    const insertMessagesQuery = messages
      .map(
        () => `
        INSERT INTO ai_thread_messages (thread_id, message)
        VALUES (@id, @message);
        `
      )
      .join('')

    const messageParams = messages.reduce((acc: { [key: string]: string }, message, id) => {
      acc[`message_${id}`] = message
      acc['id'] = id.toString()

      return acc
    }, {})

    await ExecuteQuery(insertMessagesQuery, messageParams)

    res.status(200).json({ subject, json_query, messages, id, user_id })
  } catch (error) {
    res.status(403).json({ message: 'Failed to add thread' })
  }
}

export default withAuth(handler)
