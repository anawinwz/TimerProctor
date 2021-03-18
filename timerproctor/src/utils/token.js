import { fetchAPI } from './api'
import jwt_decode from 'jwt-decode'

class TokenManager {
  constructor(key = '', isAdmin = false) {
    this.key = `${key ? `${key}_` : ''}accessToken`
    this.refreshKey = `${key ? `${key}_` : ''}refreshToken`
    this.isAdmin = isAdmin

    this.accessToken = ''
  }

  removeAccessToken() { this.accessToken = '' }

  getUserId() {
    if (!this.accessToken) return null
    try {
      const { _id } = jwt_decode(this.accessToken)
      return _id
    } catch { return null }
  }

  async renewToken(refreshToken = '') {
    try {
      const res = await fetchAPI('/users/renew', { 
        admin: this.isAdmin,
        ...(refreshToken ? { refreshToken } : {})
      })
      const { status, message, payload } = res
      if (status === 'ok') {
        const { accessToken, refreshToken = true } = payload
        this.accessToken = accessToken
        return Promise.resolve(refreshToken)
      } else {
        const error = new Error(message || 'เกิดข้อผิดพลาดในการต่ออายุการเข้าสู่ระบบ')
        error.needRelogin = true

        this.removeAccessToken()

        return Promise.reject(error)
      }
    } catch {
      return Promise.reject(new Error('เกิดข้อผิดพลาดในการต่ออายุการเข้าสู่ระบบ'))
    }
  }
}

export const userToken = new TokenManager()
export const adminToken = new TokenManager('admin', true)
