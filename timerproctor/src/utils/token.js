const localStorage = window.localStorage

const key = 'token'

export const getToken = () => localStorage.getItem(key) || ''
export const saveToken = token => localStorage.setItem(key, token)
export const removeToken = () => localStorage.removeItem(key)
