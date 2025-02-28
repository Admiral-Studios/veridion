// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType, ChangedUserData } from './types'
import toast from 'react-hot-toast'

// ** Defaults
const unprotectedRoutes = ['/verify', '/recovery']

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refresh: () => Promise.resolve(),
  changeUser: () => Promise.resolve(),
  delete: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
  trackOnClick: () => Promise
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const getProductsLimit = (role: string) => {
  switch (role) {
    case 'admin': {
      return 5000
    }

    case 'veridioner': {
      return 5000
    }

    case 'member': {
      return 50
    }

    default: {
      return 50
    }
  }
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post('/api/auth/login', params, { withCredentials: true })
      .then(async response => {
        const returnUrl = router.query.returnUrl
        setUser({
          ...response.data.userData,
          username: response.data.userData.user_name,
          max_product_limit: getProductsLimit(response.data.userData.role)
        })

        window.localStorage.setItem('userData', JSON.stringify(response.data.userData))

        const redirectURL = returnUrl && returnUrl !== '/home' ? returnUrl : '/home'
        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback({ message: err.response.data.message })
      })
  }

  const handleLogout = async (redirectUrl = '/login') => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    localStorage.removeItem('requestedTrialAccess')

    await axios.post('/api/auth/logout', {})
    router.push(redirectUrl)
  }

  const handleRefresh = async () => {
    try {
      await axios.post('/api/refresh', {}, { withCredentials: true })
    } catch (error) {
      handleLogout()
    }
  }

  const changeUser = async (changedUser: ChangedUserData, callback: () => void) => {
    const { data } = await axios.patch(`/api/user/change`, { ...changedUser, id: user?.id })

    setUser(prev => ({ ...prev, ...data, industry: data.industryVertical }))

    callback()
  }

  const deleteUser = async () => {
    try {
      await axios.post(`/api/user/delete`, { id: user?.id })

      handleLogout('/register')
    } catch (error) {}
  }

  const changePassword = async (body: { password: string; newPassword: string }) => {
    try {
      await axios.patch(`/api/user/password-change`, { ...body, id: user?.id })
      toast.success('Password Changed Successfully')
    } catch (error) {
      toast.error('Failed To Change Password')
    }
  }

  const trackOnClick = (event: string) => {
    axios.post('/api/user/track', { clickedOn: event, userId: user?.id })
  }

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true)
      if (!unprotectedRoutes.includes(router.route)) {
        await axios
          .get('/api/auth/me', { withCredentials: true })
          .then(async response => {
            setUser({
              ...response.data.userData,
              username: response.data.userData.user_name,
              max_product_limit: getProductsLimit(response.data.userData.role)
            })
          })
          .catch(() => {
            handleLogout()
            if (router.route !== '/login') {
              router.replace('/login')
            }
          })
      }

      setLoading(false)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    refresh: handleRefresh,
    changeUser,
    delete: deleteUser,
    changePassword,
    trackOnClick
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
