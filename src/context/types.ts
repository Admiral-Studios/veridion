export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
  apiKey: string
  name: string
  company: string
  title: string
  role_id: number
  max_product_limit: number
  industry: string
  requested_elevanted_access: boolean
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  refresh: () => void
  changeUser: (userData: ChangedUserData, callback: () => void) => void
  delete: () => void
  changePassword: (body: { password: string; newPassword: string }) => void
  trackOnClick: (event: string) => void
}

export interface ChangedUserData {
  email?: string
  username?: string
  apiKey?: string
  requested_elevanted_access?: boolean
  industryVertical: string
}
