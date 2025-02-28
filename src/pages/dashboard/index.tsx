import { GetServerSidePropsContext } from 'next/types'

const DashboardPage = () => {
  return null
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!ctx.params?.page) {
    ctx.res.writeHead(302, { Location: '/dashboard/coverage' })
    ctx.res.end()
  }

  return { props: {} }
}

export default DashboardPage
