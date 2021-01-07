import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import firebase from 'firebase/app'
import { auth } from '../utils/firebase'
import { saveToken } from '../utils/token'
import { fetchAPI } from '../utils/api'

class AuthStore {
  @observable loggingIn = false

  @persist @observable userId = ''
  @persist @observable displayName = ''
  @persist @observable photoURL = ''

  constructor(rootStore) {
    this.rootStore = rootStore
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
            return this.login({ user, credential })
          })
      })
      .catch(e => {
        this.loggingIn = false
        if (e.message === 'The popup has been closed by the user before finalizing the operation.')
          e.message = 'คุณปิดหน้าต่าง การเข้าสู่ระบบถูกยกเลิก กรุณาเริ่มใหม่'
        throw e
      })
  }

  @action
  async login({ user, credential }) {
    const idToken = await user.getIdToken()
    const response = await fetchAPI(`/users/login`, { idToken })
    
    const { status, token, info, message } = response
    if (status && status === 'ok') {
      saveToken(token)

      const { displayName, photoURL } = info
      this.setUser({ userId: user.uid, displayName, photoURL })
      
      return true
    } else {
      throw new Error(message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    }
  }

  @action
  setUser({ displayName, photoURL }) {
    this.displayName = displayName
    this.photoURL = photoURL
  }
}

export default AuthStore