import { NextApiRequest, NextApiResponse } from 'next/types'
import sql, { ConnectionPool, Request } from 'mssql'
import { dbConfig } from 'src/configs/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { subject, user_id, json_query, messages } = req.body as {
      subject: string
      user_id: number
      json_query: string
      messages: string[]
    }

    const pool: ConnectionPool = await sql.connect(dbConfig)
    const request: Request = pool.request()

    request.input('json_query', sql.NVarChar, json_query)
    request.input('subject', sql.NVarChar, subject)

    const insertQuery = `INSERT INTO user_ai_threads (subject, user_id, json_query) VALUES (@subject, '${user_id}', @json_query); SELECT SCOPE_IDENTITY() AS id;`

    const { recordset } = await request.query(insertQuery)

    const insertMessagesQuery = messages
      .map((message, id) => {
        request.input(`message_${id}`, sql.NVarChar, message)

        return `INSERT INTO ai_thread_messages (thread_id, message) VALUES ('${recordset[0].id}', @message_${id});`
      })
      .join('')

    await request.query(insertMessagesQuery)

    res.status(200).json({ id: recordset[0].id })
  } catch (error) {
    res.status(403).json({ message: 'Failed to add thread' })
  }
}
