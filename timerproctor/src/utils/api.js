export const fetchAPI = async (endpoint, body) => {
  try {
    const url = `http://localhost:5000${endpoint}`
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
