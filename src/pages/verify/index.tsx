import { Box, Button, Typography } from '@mui/material'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import React, { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'

interface IProps {
  isVerified: boolean
  message: string
  email: string
}

const VerifyPage: NextPage<IProps> = () => {
  const { push, query, isReady } = useRouter()

  const [isVerified, setIsVerified] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  const goToLogin = () => {
    push('/login')
  }

  const resendVerificationLink = async () => {
    try {
      await axios.post('/api/auth/verify/resend', { email })
      toast.success('Verification link resent successfully')
    } catch (error) {
      toast.error('Failed to resend verification link. Please try again!')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.post<{ isVerified: boolean; message: string; email: string }>('/api/auth/verify', {
        token: query?.token
      })
      setMessage(data.message)
      setIsVerified(data.isVerified)
      setEmail(data.email)

      setLoading(false)
    }

    if (isReady) {
      if (query?.token) {
        fetchData()
      } else {
        setIsVerified(false)
        setMessage('No token provided')

        setLoading(false)
      }
    }
  }, [query?.token, isReady])

  if (loading) return null

  return (
    <Box className='content-center'>
      <Box
        sx={{
          textAlign: 'center'
        }}
      >
        {isVerified ? (
          <Icon fontSize='84px' color='#03ca03' icon='zondicons:checkmark-outline' />
        ) : (
          <Icon fontSize='84px' icon='fxemoji:crossmark' />
        )}
        <Typography
          component='h2'
          sx={{
            fontSize: '22px',
            marginTop: '16px'
          }}
        >
          {message}
        </Typography>
        {isVerified ? (
          <Button onClick={goToLogin} variant='contained' sx={{ mt: 4 }}>
            Go To Login
          </Button>
        ) : (
          <Button onClick={resendVerificationLink} variant='contained' sx={{ mt: 4 }}>
            Resend verification link
          </Button>
        )}
      </Box>
    </Box>
  )
}

VerifyPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

VerifyPage.guestGuard = false
VerifyPage.authGuard = false

export default VerifyPage
