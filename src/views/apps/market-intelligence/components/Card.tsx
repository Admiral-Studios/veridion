import { Card, CardContent, Typography } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'

export const DataCard = ({ data }: { data: { title: string; count: number | string }[] }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'primary.main',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {data.map(({ title, count }) => (
        <CardContent key={title} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6'>{title}</Typography>

          <CustomAvatar
            color='primary'
            variant='rounded'
            sx={{
              ml: 4,
              width: 48,
              height: 30,
              fontWeight: 500,
              color: 'common.white',
              backgroundColor: 'primary.dark'
            }}
          >
            {count}
          </CustomAvatar>
        </CardContent>
      ))}
    </Card>
  )
}
