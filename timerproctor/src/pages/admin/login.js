import { Redirect } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import IntroLogin from '~/components/admin/IntroLogin'
import useSuffixTitle from '~/hooks/useSuffixTitle'

const AdminLogin = () => {
  const { AuthStore: { isLoggedIn } } = useStore()
  useSuffixTitle('เข้าสู่ระบบจัดการการสอบ')

  if (isLoggedIn) return <Redirect to="/admin/dashboard" />
  return (
    <>
      <IntroLogin />
    </>
  )
}

export default observer(AdminLogin)
