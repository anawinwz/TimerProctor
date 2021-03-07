import { fetchAPI } from './api'
import jwt_decode from 'jwt-decode'

const localStorage = typeof window === 'undefined' ? {} : window.localStorage

class TokenManager {
  constructor(key = '', isAdmin = false) {
    this.key = `${key ? `${key}_` : ''}accessToken`
    this.refreshKey = `${key ? `${key}_` : ''}refreshToken`
    this.isAdmin = isAdmin
  }

  get accessToken() { return localStorage.getItem(this.key) || '' }
  set accessToken(token) { localStorage.setItem(this.key, token) }
  removeAccessToken() { return localStorage.removeItem(this.key) }

  getUserId() {
    if (!this.accessToken) return null
    try {
      const { _id } = jwt_decode(this.accessToken)
      return _id
    } catch { return null }
  }

  get refreshToken() { return localStorage.getItem(this.refreshKey) || '' }
  set refreshToken(token) { localStorage.setItem(this.refreshKey, token) }
  removeRefreshToken() { return localStorage.removeItem(this.refreshKey) }
  
  async renewToken() {
    try {
      const res = await fetchAPI('/users/renew', { refreshToken: this.refreshToken, admin: this.isAdmin })
      const { status, message, payload } = res
      if (status === 'ok') {
        const { accessToken, refreshToken } = payload
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        return Promise.resolve(true)
      } else {
        const error = new Error(message || 'เกิดข้อผิดพลาดในการต่ออายุการเข้าสู่ระบบ')
        error.needRelogin = true

        this.removeAccessToken()
        this.removeRefreshToken()

        return Promise.reject(error)
      }
    } catch {
      return Promise.reject(new Error('เกิดข้อผิดพลาดในการต่ออายุการเข้าสู่ระบบ'))
    }
  }
}

export const userToken = new TokenManager()
export const adminToken = new TokenManager('admin', true)
