import { Redirect } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import IntroLogin from '~/components/admin/IntroLogin'

const AdminLogin = () => {
  const { AuthStore: { isLoggedIn } } = useStore()
  if (isLoggedIn) return <Redirect to="/admin/dashboard" />
  return (
    <>
      <IntroLogin />
    </>
  )
}

export default observer(AdminLogin)
