import { action, computed, observable } from 'mobx'
import { persist, create } from 'mobx-persist'
import firebase from 'firebase/app'
import { auth } from '../utils/firebase'
import { fetchAPI } from '../utils/api'

class Auth {
  @observable loggingIn = false
  @persist @observable userId = ''
  @persist @observable displayName = ''
  @persist('object') @observable idCheck = {
    sendState: ['IDLE', ''],
    accepted: null,
    reason: ''
  }

  @computed
  get isLoggedIn() {
    return !!this.userId
  }

  @action
  async doAuthen(method = 'google') {
    this.loggingIn = true
    
    let providerName = ''
    let providerScopes = []
    switch (method) {
      case 'google':
        providerName = 'GoogleAuthProvider'
        break
      default:
        throw new Error(`Invalid login method.`)
    }

    await auth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        const provider = new firebase.auth[providerName]()
        for (const scope of providerScopes) provider.addScope(scope)
        return auth.signInWithPopup(provider)
          .then(result => {
            const { user, credential } = result
            this.setUser({
              userId: user.uid,
              displayName: user.displayName
            })
            return true
          })
      })
      .catch(e => {
        this.loggingIn = false
        throw e
      })
  }

  @action
  setUser({ userId, displayName }) {
    this.userId = userId
    this.displayName = displayName
  }

  @action
  setIDCheckState(state) {
    this.idCheck.sendState = state
  }

  @action
  setIDCheckResult(accepted, reason = '') {
    this.idCheck.accepted = accepted
    this.idCheck.reason = reason
  }

  @action
  submitIDCheck(image) {
    return fetchAPI(`/users/submitIDCheck`, {
      userId: this.userId,
      image: image
    })
  }

  @computed
  get isIDApproved() {
    return this.idCheck.accepted === true
  }
}

const hydrate = create()
const AuthStore = new Auth()
export default AuthStore
hydrate('auth', AuthStore)

