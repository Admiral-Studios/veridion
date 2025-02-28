// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const ACLPage = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)

  const { data: emails } = useSWR(`/api/user/get_by_role?role=admin`, fetcher)

  if (!emails) return null

  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='No role assigned' />
          <CardContent>
            <Typography sx={{ mb: 4 }}>No ability is required to view this card</Typography>
            <Typography sx={{ color: 'error.main' }}>
              You have no role assigned yet by your administrator so you can't see any reports yet. Please contact your
              admin,
              {
                <span style={{ fontWeight: 'bold' }}>
                  &nbsp;
                  {emails.length > 0 ? emails.join(' or ') : emails[0]}
                  &nbsp;
                </span>
              }
              and request access to your reports.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {ability?.can('read', 'analytics') ? (
        <Grid item md={6} xs={12}>
          <Card>
            <CardHeader title='Analytics' />
            <CardContent>
              <Typography sx={{ mb: 4 }}>User with 'Analytics' subject's 'Read' ability can view this card</Typography>
              <Typography sx={{ color: 'error.main' }}>This card is visible to 'admin' only</Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : null}
    </Grid>
  )
}

ACLPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default ACLPage
