import { Redirect } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import IntroLogin from '~/components/admin/IntroLogin'
import useAppTitle from '~/hooks/useAppTitle'

const AdminLogin = () => {
  const { AuthStore: { isLoggedIn } } = useStore()
  useAppTitle('เข้าสู่ระบบ', { admin: true })

  if (isLoggedIn) {
    const nextURL = window.sessionStorage.getItem('nextURL')
    if (nextURL) window.sessionStorage.removeItem('nextURL')
    return <Redirect to={nextURL || '/admin/dashboard'} />
  }
  return (
    <>
      <IntroLogin />
    </>
  )
}

export default observer(AdminLogin)
