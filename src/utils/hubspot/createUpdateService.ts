import axios from 'axios'
import { industryVerticalFields } from 'src/constants/hubspot/industryVerticalFields'
import { UserDataType } from 'src/context/types'

export const createUpdateUserInHubspot = async (user: UserDataType) => {
  const body = {
    fields: [
      {
        objectTypeId: '0-1',
        name: 'email',
        value: user.email
      },
      {
        objectTypeId: '0-1',
        name: 'firstname',
        value: user.name
      },
      {
        objectTypeId: '0-1',
        name: 'jobtitle',
        value: user.title
      },
      {
        objectTypeId: '0-1',
        name: 'veridion_specific_marketing_lead_source',
        value: 'explore.veridion.com'
      },
      {
        objectTypeId: '0-1',
        name: 'industry_vertical',
        value: industryVerticalFields[user.industry as keyof typeof industryVerticalFields] || ''
      }
    ]
  }

  await axios.post(
    `https://api.hsforms.com/submissions/v3/integration/submit/${process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID}/${process.env.NEXT_PUBLIC_HUBSPOT_FORM_GUID}`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${process.env.NEXT_PUBLIC_HUBSPOT_API_KEY}`
      }
    }
  )
}
