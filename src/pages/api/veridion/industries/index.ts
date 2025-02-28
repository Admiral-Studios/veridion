import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { IndustryType } from 'src/views/apps/full_search/types/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.get<IndustryType[]>('https://data.veridion.com/industries/v0', {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_VERIDION_PRESENTATION_API_KEY
      }
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(403).json({ message: 'Failed to fetch industries' })
  }
}
