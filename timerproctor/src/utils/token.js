const sessionStorage = window.sessionStorage

const key = 'token'

export const getToken = () => sessionStorage.getItem(key) || ''
export const saveToken = token => sessionStorage.setItem(key, token)
export const removeToken = () => sessionStorage.removeItem(key)
