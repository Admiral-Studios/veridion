import { NextApiRequest, NextApiResponse } from 'next/types'
import formidable, { Files } from 'formidable'
import fs from 'fs'
import csvParser from 'csv-parser'

import { CsvCompanyUploadType } from 'src/types/apps/veridionTypes'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' })
  }

  const expectedParam = request.query.expected

  const form = formidable()

  try {
    const { files } = await new Promise<{ fields: formidable.Fields; files: Files }>((resolve, reject) => {
      form.parse(request, (error: any, fields: formidable.Fields, files: Files) => {
        if (error) {
          console.error('Formidable error:', error)
          reject(error)

          return
        }
        resolve({ fields, files })
      })
    })

    const uploadedFile = files.csvFile

    // Check if the uploadedFile is an array (multiple files uploaded)
    if (!Array.isArray(uploadedFile)) {
      return response.status(400).json({ error: 'Invalid file format' })
    }

    // Check the file is type CSV
    if (uploadedFile[0].mimetype !== 'text/csv') {
      return response.status(400).json({ error: 'Invalid file format. Only CSV files are allowed.' })
    }

    const readStream = fs.createReadStream(uploadedFile[0].filepath)

    //TODO validate header of the CSV
    const rows: CsvCompanyUploadType[] = []
    readStream
      .pipe(csvParser())
      .on('headers', (headers: string[]) => {
        if (expectedParam) {
          const expectedHeaders = (expectedParam as string).split(',')

          const valid = checkHeaders(
            headers.map(h =>
              h
                .split('')
                .filter(h => h !== '﻿')
                .join('')
            ),
            expectedHeaders
          )

          if (!valid) {
            return response.status(400).json({
              error:
                'Invalid CSV. Please upload a CSV with valid headers. You can download our sample and use it when you want to enrich'
            })
          }
        }
      })
      .on('data', (row: CsvCompanyUploadType) => {
        rows.push(row)
      })
      .on('end', () => {
        response.status(200).json({ rows })
      })
  } catch (err) {
    console.error('Error:', err)
    response.status(500).json({ error: err })
  }
}

function checkHeaders(actualHeaders: string[], expectedHeaders: string[]): boolean {
  return expectedHeaders.every(header => {
    return actualHeaders.includes(header)
  })
}
