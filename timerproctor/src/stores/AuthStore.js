import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import firebase from 'firebase/app'
import { auth } from '~/utils/firebase'
import { userToken, adminToken } from '~/utils/token'
import { fetchAPI } from '~/utils/api'

class AuthStore {
  @observable loggingIn = false

  @persist @observable userId = ''
  
  @persist @observable email = ''
  @persist @observable displayName = ''
  @persist @observable photoURL = ''

  constructor(rootStore, fromAdmin = false) {
    this.rootStore = rootStore
    this.fromAdmin = fromAdmin
    this.token = this.fromAdmin ? adminToken : userToken
  }

  @computed
  get isLoggedIn() {
    return this.userId.length > 0
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
    const response = await fetchAPI(`/users/login`, { idToken, admin: this.fromAdmin })
    
    const { status, payload, message } = response
    if (status && status === 'ok') {
      const { accessToken, refreshToken, email, info } = payload
      const { displayName, photoURL } = info
      this.setUser({ userId: user.uid, email, displayName, photoURL })

      this.token.accessToken = accessToken
      this.token.refreshToken = refreshToken
      
      return true
    } else {
      throw new Error(message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    }
  }

  @action
  setUser({ userId, email, displayName, photoURL }) {
    this.userId = userId
    this.email = email
    this.displayName = displayName
    this.photoURL = photoURL
  }

  @action
  async logout() {
    try {
      await auth.signOut()
    } finally {
      this.setUser({ userId: '', email: '', displayName: '', photoURL: '' })
      
      this.token.removeAccessToken()
      this.token.removeRefreshToken()
    }
  }
}

export default AuthStore
