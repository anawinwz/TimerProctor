import { Redirect } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import IntroLogin from '~/components/admin/IntroLogin'
import useAppTitle from '~/hooks/useAppTitle'
import { getNextURL, removeNextURL } from '~/utils/redirect'

const AdminLogin = () => {
  const { AuthStore: { isLoggedIn, token } } = useStore()
  useAppTitle('เข้าสู่ระบบ', { admin: true })

  if (isLoggedIn && token.accessToken) {
    const nextURL = getNextURL()
    if (nextURL) removeNextURL()
    return <Redirect to={nextURL || '/admin/dashboard'} />
  }
  return (
    <>
      <IntroLogin />
    </>
  )
}

export default observer(AdminLogin)
