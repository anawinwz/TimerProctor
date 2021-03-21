import { action, computed, observable } from 'mobx'
import firebase from 'firebase/app'
import { auth } from '~/utils/firebase'
import { userToken, adminToken } from '~/utils/token'
import { fetchAPI } from '~/utils/api'

class AuthStore {
  @observable loggingIn = false
  @observable emailLoggingIn = ''

  @observable firebaseUID = ''
  @observable email = ''
  @observable displayName = ''
  @observable photoURL = ''

  constructor(rootStore, fromAdmin = false) {
    this.rootStore = rootStore
    this.fromAdmin = fromAdmin
    this.token = this.fromAdmin ? adminToken : userToken
  }

  @computed
  get isLoggedIn() {
    return this.firebaseUID.length > 0
  }

  @computed
  get userId() {
    return this.token.getUserId()
  }

  @action
  doAuthen(method = 'google') {
    this.loggingIn = true
    
    let providerProcess = 'normal'
    let providerName = ''
    let providerScopes = []
    switch (method) {
      case 'google':
        providerName = 'GoogleAuthProvider'
        break
      case 'email':
        providerProcess = 'email'
        break
      default:
        this.isLoggedIn = false
        throw new Error(`Invalid login method.`)
    }

    if (providerProcess === 'normal') {
      return auth
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
    } else if (providerProcess === 'email') {
      const email = window.prompt('กรุณาระบุอีเมลที่ต้องการรับลิงก์เข้าสู่ระบบ')
      if (email !== null) {
        return auth.sendSignInLinkToEmail(email, {
          url: window.location.href,
          handleCodeInApp: true
        })
        .then(() => {
          window.localStorage.setItem('tp_emailToLogin', email)
          return {
            message: <>
              ระบบได้ส่งลิงก์เข้าสู่ระบบไปยัง { email } เรียบร้อยแล้ว<br/>
              ให้<b><u>ปิดหน้าเว็บนี้</u></b> และใช้ลิงก์ดังกล่าวในการเข้าสอบแทน
            </>,
            onOk: () => window.close()
          }
        })
        .catch(e => {
          this.loggingIn = false
          if (e.message.includes('The email address is badly formatted.'))
            e.message = 'รูปแบบอีเมลไม่ถูกต้อง/ไม่ได้มาตรฐาน'
          throw e
        })
      } else {
        this.loggingIn = false
        return false
      }
    }
  }

  @action
  doEmailCallback() {
    if (!auth.isSignInWithEmailLink(window.location.href)) return false

    this.loggingIn = true
    const email = window.localStorage.getItem('tp_emailToLogin')
    if (!email) {
      alert('กรุณาเปิดลิงก์เข้าสู่ระบบจากอีเมลด้วยเครื่องเดียวกัน')
      this.loggingIn = false
      return false
    }

    this.emailLoggingIn = email
    return auth.signInWithEmailLink(email, window.location.href)
      .then(result => {
        const { user, credential } = result
        return this.login({ user, credential })
      })
      .catch(e => {
        this.loggingIn = false
        this.emailLoggingIn = ''
        if (e?.code === 'auth/invalid-action-code') {
          e.message = 'ลิงก์เข้าสู่ระบบอีเมลหมดอายุหรือถูกใช้ไปแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง'
        }
        throw e
      })
  }

  @action
  async login({ user, credential }) {
    const idToken = await user.getIdToken()
    const response = await fetchAPI(`/users/login`, { idToken, admin: this.fromAdmin })
    
    const { status, payload, message } = response
    if (status && status === 'ok') {
      window.localStorage.removeItem('tp_emailToLogin')

      const { accessToken, email, info } = payload
      const { displayName, photoURL } = info
      this.setUser({ firebaseUID: user.uid, email, displayName, photoURL })

      this.token.accessToken = accessToken
      
      return true
    } else {
      this.logout()
      throw new Error(message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    }
  }

  @action
  setUser({ firebaseUID, email, displayName, photoURL }) {
    this.firebaseUID = firebaseUID
    this.email = email
    this.displayName = displayName
    this.photoURL = photoURL
  }

  @action
  async logout() {
    try {
      await auth.signOut()
    } finally {
      this.emailLoggingIn = ''
      this.setUser({ firebaseUID: '', email: '', displayName: '', photoURL: '' })
      
      this.token.removeAccessToken()
    }
  }
}

export default AuthStore
