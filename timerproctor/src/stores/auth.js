import { action, computed, makeAutoObservable } from 'mobx'
import { fetchAPI } from '../utils/api'

class Auth {
  userId = ''
  displayName = ''
  idCheck = {
    accepted: null,
    reason: ''
  }

  constructor() {
    makeAutoObservable(this)
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
  setIDCheck(accepted, reason = '') {
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

const AuthStore = new Auth()
export default AuthStore
