/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  if (role === 'visitor') return '/acl'
  else return '/home'
}

export default getHomeRoute
