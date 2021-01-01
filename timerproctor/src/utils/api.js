import { getToken } from './token'

const baseUrl = `http://localhost:5000`

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
    const res = await fetch(url, !body ? {} : {
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
