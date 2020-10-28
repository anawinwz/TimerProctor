export const fetchAPI = async (endpoint) => {
  try {
    const url = `http://localhost:5000${endpoint}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (err) {
    throw err
  }
}
