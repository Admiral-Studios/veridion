// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import * as yup from 'yup'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useController, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import toast from 'react-hot-toast'

import { checkIfEmailPersonal } from 'src/utils/personalEmailValidator'
import { MenuItem } from '@mui/material'

// ** Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
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
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  user_name: yup.string().min(3),
  password: yup.string().min(5).required(),
  company: yup.string().required(),
  name: yup.string(),
  title: yup.string().required(),
  industryVertical: yup.string()
})

const defaultValues = {
  email: '',
  user_name: '',
  password: '',
  company: '',
  title: '',
  name: '',
  industryVertical: ''
}

const Register = () => {
  const router = useRouter()

  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [userData, setUserData] = useState({
    email: '',
    user_name: '',
    password: '',
    company: '',
    title: '',
    name: '',
    industryVertical: ''
  })
  const [errorText, setErrorText] = useState('')

  // ** Hooks
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    handleSubmit,
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

  const { field: user_name } = useController({
    name: 'user_name',
    control: control
  })

  const { field: password } = useController({
    name: 'password',
    control: control
  })

  const { field: company } = useController({
    name: 'company',
    control: control
  })

  const { field: name } = useController({
    name: 'name',
    control: control
  })

  const { field: title } = useController({
    name: 'title',
    control: control
  })

  const { field: industryVertical } = useController({
    name: 'industryVertical',
    control: control
  })

  // ** Vars

  const signUp = async () => {
    const emailDomain = userData.email.split('@')[1]

    if (checkIfEmailPersonal(emailDomain)) {
      setErrorText('Registration is only available for corporate accounts')

      return
    }

    try {
      const response = await axios.post('/api/auth/register', userData)
      console.log(response)
      if (response.data?.message) {
        return setErrorText(response.data?.message)
      }
      toast.success(
        'The account has been successfully created. Please confirm your email, we have sent a confirmation email',
        { duration: 10000 }
      )
      router.push('/login')
    } catch (e) {
      console.log(e)
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
          <RegisterIllustration
            alt='register-illustration'
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
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Veridion Data Discovery Platform
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Create your secure account to discover our data universe
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(signUp)}>
              <CustomTextField
                autoFocus
                fullWidth
                value={user_name.value}
                sx={{ mb: 4 }}
                label='Username'
                placeholder='johndoe'
                onChange={e => {
                  setUserData({ ...userData, ...{ user_name: e.target.value } })
                  user_name.onChange(e.target.value)
                }}
                error={Boolean(errors.user_name)}
                {...(errors.user_name && { helperText: errors.user_name.message })}
              />

              <CustomTextField
                fullWidth
                label='Name'
                value={name.value}
                sx={{ mb: 4 }}
                placeholder='your name'
                onChange={e => {
                  setUserData({ ...userData, ...{ name: e.target.value } })
                  name.onChange(e.target.value)
                }}
                error={Boolean(errors.name)}
                {...(errors.name && { helperText: errors.name.message })}
              />

              <CustomTextField
                fullWidth
                label='Email'
                value={email.value}
                sx={{ mb: 4 }}
                placeholder='user@email.com'
                required
                onChange={e => {
                  setUserData({ ...userData, ...{ email: e.target.value } })
                  email.onChange(e.target.value)
                }}
                error={Boolean(errors.email)}
                {...(errors.email && { helperText: errors.email.message })}
              />

              <CustomTextField
                fullWidth
                label='Company'
                value={company.value}
                sx={{ mb: 4 }}
                placeholder='company name'
                required
                onChange={e => {
                  setUserData({ ...userData, ...{ company: e.target.value } })
                  company.onChange(e.target.value)
                }}
                error={Boolean(errors.company)}
                {...(errors.company && { helperText: errors.company.message })}
              />

              <CustomTextField
                fullWidth
                label='Job Title'
                value={title.value}
                sx={{ mb: 4 }}
                placeholder='title'
                required
                onChange={e => {
                  setUserData({ ...userData, ...{ title: e.target.value } })
                  title.onChange(e.target.value)
                }}
                error={Boolean(errors.title)}
                {...(errors.title && { helperText: errors.title.message })}
              />

              <CustomTextField
                label='Industry Vertical'
                variant='outlined'
                size='small'
                select
                fullWidth
                value={industryVertical.value}
                error={Boolean(errors.industryVertical)}
                {...(errors.industryVertical && { helperText: errors.industryVertical.message })}
                SelectProps={{
                  onChange: (e: any) => {
                    setUserData({ ...userData, ...{ industryVertical: e.target.value } })
                    industryVertical.onChange(e.target.value)
                  }
                }}
                sx={{ mb: 4 }}
              >
                {['Market Intelligence', 'Insurance', 'Procurement', 'Other'].map(v => (
                  <MenuItem
                    key={v}
                    value={v}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    {v}
                  </MenuItem>
                ))}
              </CustomTextField>

              <CustomTextField
                onChange={e => {
                  setUserData({ ...userData, ...{ password: e.target.value } })
                  password.onChange(e.target.value)
                }}
                value={password.value}
                fullWidth
                sx={{ mb: 4 }}
                error={Boolean(errors.password)}
                {...(errors.password && { helperText: errors.password.message })}
                label='Password'
                id='auth-login-v2-password'
                type={showPassword ? 'text' : 'password'}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Sign up
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                <Typography component={LinkStyled} href='/login'>
                  Sign in instead
                </Typography>
              </Box>
              {errorText ? (
                <Typography
                  sx={{
                    color: 'red',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: 2
                  }}
                >
                  {errorText}
                </Typography>
              ) : null}
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
