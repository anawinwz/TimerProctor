import { action, computed, makeAutoObservable } from 'mobx'

class Auth {
  userId = ''
  displayName = ''
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
}

const AuthStore = new Auth()
export default AuthStore
