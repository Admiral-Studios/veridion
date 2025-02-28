import axios from 'axios'
import * as pbi from 'powerbi-client'

const MINUTES_BEFORE_EXPIRATION = 20
const INTERVAL_TIME = 30000

let tokenExpiration: string
let timer: NodeJS.Timer

const getNewAccessToken = async () => {
  const { data } = await axios('/api/powerbi/report-token')

  return data
}

export async function initializeTokenManager(report: pbi.Report) {
  timer = setInterval(async () => await checkTokenAndUpdate(report), INTERVAL_TIME)

  updateToken(report)

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkTokenAndUpdate(report)
    }
  })
}

async function checkTokenAndUpdate(report: pbi.Report) {
  const currentTime = Date.now()
  const expiration = Date.parse(tokenExpiration)
  const timeUntilExpiration = expiration - currentTime
  const timeToUpdate = MINUTES_BEFORE_EXPIRATION * 60 * 1000

  if (timeUntilExpiration <= timeToUpdate) {
    console.log('Updating report access token')
    await updateToken(report)
  }
}

async function updateToken(report: pbi.Report) {
  const newAccessToken: { token: string; expiration: string } = await getNewAccessToken()
  tokenExpiration = newAccessToken.expiration

  await report.setAccessToken(newAccessToken.token)
}

export function stopTokenManager() {
  clearInterval(timer)
}
