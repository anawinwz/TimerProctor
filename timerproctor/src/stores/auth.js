import { action, computed, observable } from 'mobx'
import { persist, create } from 'mobx-persist'
import { fetchAPI } from '../utils/api'

class Auth {
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

