import { useTitle } from 'react-use'

const useSuffixTitle = (title, options) => 
  useTitle(title ? `${title} - TimerProctor` : 'TimerProctor', options)

export default useSuffixTitle
