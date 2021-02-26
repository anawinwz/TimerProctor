import axios from 'axios'
import { userToken, adminToken } from './token'

export class APIFailedError extends Error {
  constructor(message) {
    super(message)
  }
}

export const baseUrl = process.env.REACT_APP_API_BASEURL || 'http://localhost:5000'

export const fetchAPI = async (endpoint, body = null) => {
  try {
    const url = `${baseUrl}${endpoint}`
    const res = await axios(url, !body ? {} : {
      method: 'POST',
      data: body
    })
    
    const { data } = res
    return data
  } catch (err) {
    throw err
  }
}

export const fetchAPIwithToken = async (endpoint, body = null, token = userToken) => {
  try {
    const url = `${baseUrl}${endpoint}`
    const res = await axios(url, 
      !body ?
      {
        headers: { 'X-Access-Token': token.accessToken },
      } :
      {
        method: 'POST',
        headers: {
          'X-Access-Token': token.accessToken,
        },
        data: body
      })
    
    const { data } = res
    if (data.status === 'tokenExpired') {
      return token.renewToken().then(() => {
        fetchAPIwithToken(endpoint, body, token)
      })
    }
    return data
  } catch (err) {
    throw err
  }
}

export const fetchAPIwithAdminToken = (endpoint, body) => fetchAPIwithToken(endpoint, body, adminToken)
