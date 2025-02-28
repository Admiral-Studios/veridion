import { NextApiRequest, NextApiResponse } from 'next/types'
import fs from 'fs'

// import path from 'path'
import csvParser from 'csv-parser'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const filePath = request.query.filePath as string

  const results: any = []

  fs.createReadStream(`./public/data_samples/${filePath}.csv`)
    .pipe(csvParser())
    .on('data', data => results.push(data))
    .on('end', () => {
      return response.status(200).json(results)
    })
}
