import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStore } from '~/stores/admin'
import { Card, message } from 'antd'

import GoogleLoginButton from '~/components/buttons/GoogleLoginButton'

const IntroLogin = () => {
  const { AuthStore: auth } = useStore()
  
  const history = useHistory()
  
  const login = useCallback(async method => {
    try {
      await auth.doAuthen(method)
      history.replace(`/admin/dashboard`)
    } catch (err) {
      message.error(err.message)
    }
  }, [])

  return (
    <Card className="text-center">
      <GoogleLoginButton onClick={() => login('google')} />
    </Card>
  )
}

export default observer(IntroLogin)
