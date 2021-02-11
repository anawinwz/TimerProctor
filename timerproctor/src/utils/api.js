import { getToken } from './token'

export class APIFailedError extends Error {
  constructor(message) {
    super(message)
  }
}

export const baseUrl = process.env.REACT_APP_API_BASEURL || 'http://localhost:5000'

export const fetchAPI = async (endpoint, body) => {
  try {
    const url = `${baseUrl}${endpoint}`
    const res = await fetch(url, !body ? {} : {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    const data = await res.json()
    return data
  } catch (err) {
    throw err
  }
}


export const fetchAPIwithToken = async (endpoint, body, token) => {
  try {
    const url = `${baseUrl}${endpoint}`
    const res = await fetch(url, 
      !body ?
      {
        headers: { 'X-Access-Token': token || getToken() },
      } :
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': token || getToken(),
        },
        body: JSON.stringify(body)
      })
    
    const data = await res.json()
    return data
  } catch (err) {
    throw err
  }
}
