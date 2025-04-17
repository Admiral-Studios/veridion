import { NextApiRequest, NextApiResponse } from 'next/types'
import fs from 'fs'
import csvParser from 'csv-parser'
import { withAuth } from '../../middleware/authMiddleware'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const filePath = request.query.filePath as string

  const results: any = []

  fs.createReadStream(`./public/data_samples/${filePath}.csv`)
    .pipe(csvParser())
    .on('data', data => results.push(data))
    .on('end', () => {
      return response.status(200).json(results)
    })
}

export default withAuth(handler)
