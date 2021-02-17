import { useTitle } from 'react-use'

const useAppTitle = (title, options = {}) => {
  const { admin = false, ...restOpts } = options
  const appName = admin ? 'ระบบจัดการการสอบ TimerProctor' : 'TimerProctor'
  return useTitle(title ? `${title} - ${appName}` : appName, restOpts)
}

export default useAppTitle
