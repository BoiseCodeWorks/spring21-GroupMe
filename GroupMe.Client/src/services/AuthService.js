import { initialize } from '@bcwdev/auth0provider-client'
import { AppState } from '../AppState'
import { audience, clientId, domain } from '../env'
import router from '../router'
import { accountService } from './AccountService'
import { api } from './AxiosService'

export const AuthService = initialize({
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})

AuthService.on(AuthService.AUTH_EVENTS.AUTHENTICATED, async() => {
  api.defaults.headers.authorization = AuthService.bearer
  api.interceptors.request.use(refreshAuthToken)
  AppState.identity = AuthService.identity
  await accountService.getAccount()
  // NOTE if there is something you want to do once the user is authenticated, place that here
})

AuthService.on(AuthService.AUTH_EVENTS.TOKEN_CHANGE, () => {
  api.defaults.headers.authorization = AuthService.bearer
})
async function refreshAuthToken(config) {
  const expired = !(AuthService.identity && (AuthService.identity.exp * 1000) > Date.now())
  if (expired) {
    await AuthService.getTokenSilently()
    api.defaults.headers.authorization = AuthService.bearer
  }
  return config
}
