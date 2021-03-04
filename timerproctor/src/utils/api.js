import axios from 'axios'
import { userToken, adminToken } from './token'

export class APIFailedError extends Error {
  constructor(message) {
    super(message)
  }
}

export const baseUrl = process.env.REACT_APP_API_BASEURL || 'http://localhost:5000'

export const fetchAPI = async (endpoint, body = null, method = null) => {
  try {
    const url = `${baseUrl}${endpoint}`
    const res = await axios(url, !body ? {
      method: method || 'GET'
    } : {
      method: method || 'POST',
      data: body
    })
    
    const { data } = res
    return data
  } catch (err) {
    throw err
  }
}

export const fetchAPIwithToken = async (endpoint, body = null, method = null, token = userToken) => {
  try {
    const url = `${baseUrl}${endpoint}`
    const res = await axios(url, 
      !body ?
      {
        method: method || 'GET',
        headers: { 'X-Access-Token': token.accessToken },
      } :
      {
        method: method || 'POST',
        headers: {
          'X-Access-Token': token.accessToken,
        },
        data: body
      })
    
    const { data } = res
    if (data.status === 'tokenExpired') {
      try {
        await token.renewToken()
        return fetchAPIwithToken(endpoint, body, null, token)
      } catch (err) {
        console.log(err, err.needRelogin)
        if (err.needRelogin && token.isAdmin) {
          window.sessionStorage.setItem('nextURL', window.location.pathname)
          window.location = '/admin/login'
          return false
        } else {
          throw err
        }
      }
    }
    return data
  } catch (err) {
    throw err
  }
}

export const fetchAPIwithAdminToken = (endpoint, body, method) => fetchAPIwithToken(endpoint, body, method, adminToken)
