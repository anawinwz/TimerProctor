import { makeAutoObservable } from 'mobx'

class Auth {
  userId = ''
  displayName = 'anawin'
  constructor() {
    makeAutoObservable(this)
  }
}

const AuthStore = new Auth()
export default AuthStore
