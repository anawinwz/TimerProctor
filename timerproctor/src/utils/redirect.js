export const setNextURL = url => {
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem('nextURL', url)
      return true
    } catch {
      return false
    }
  } else {
    return false
  }
}

export const getNextURL = location => {
  if (!location) 
    location = typeof window === 'undefined' ? {} : window.location

  if (location.search) {
    const url = (new URLSearchParams(location.search)).get('nextURL')
    if (url) return url
  }
  if (typeof window !== 'undefined')
    return window.sessionStorage.getItem('nextURL')
  return ''
}

export const removeNextURL = () => {
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.removeItem('nextURL')
    } catch {
    } finally {
      return true
    } 
  } else {
    return true
  }
}
