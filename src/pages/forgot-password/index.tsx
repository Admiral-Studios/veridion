// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import * as yup from 'yup'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import Image from 'next/image'
import { useController, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  height: '100%',
  width: '100%',
  borderRadius: '20px',
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  objectFit: 'cover'
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

interface FormData {
  email: string
}

const schema = yup.object().shape({
  email: yup.string().email('Email must be valid').required('Email is a required field')
})

const defaultValues: FormData = {
  email: ''
}

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const { field: email } = useController({
    name: 'email',
    control: control
  })

  const submit = async (data: FormData) => {
    try {
      setIsLoading(true)
      await axios.post('/api/auth/forgot-password', { ...data })
      toast.success('Further instructions have been sent to your email', { duration: 7000 })
      push('/login')
    } catch (error: any) {
      if (error) {
        setError('email', {
          type: 'manual',
          message: error?.response?.data?.message
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={process.env.NEXT_PUBLIC_LOGIN_IMAGE_PATH || '/images/login-register-image.jpg'}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Image
              width={parseInt(process.env.NEXT_PUBLIC_MAIN_LOGO_WIDTH || '250')}
              height={parseInt(process.env.NEXT_PUBLIC_MAIN_LOGO_HEIGHT || '112')}
              alt='Veridion'
              src={process.env.NEXT_PUBLIC_MAIN_LOGO_PATH || '/images/branding/main_logo.png'}
              priority={true}
            />
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                Forgot Password? 🔒
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Enter your email and we&prime;ll send you instructions to reset your password
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(submit)}>
              <CustomTextField
                fullWidth
                autoFocus
                type='email'
                label='Email'
                required
                sx={{ display: 'flex', mb: 4 }}
                value={email.value}
                onChange={email.onChange}
                error={Boolean(errors.email)}
                {...(errors.email && { helperText: errors.email.message })}
              />
              <Button fullWidth type='submit' variant='contained' disabled={isLoading} sx={{ mb: 4 }}>
                Send reset link
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword
