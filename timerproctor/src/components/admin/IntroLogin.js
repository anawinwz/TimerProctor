import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Space, Typography, message } from 'antd'
import { observer } from 'mobx-react'
import { useStore } from '~/stores/admin'

import Logo from '~/components/Logo'
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
      <Space direction="vertical">
        <Logo size="large" />
        <Typography.Title level={4}>ระบบจัดการการสอบ</Typography.Title>
        <GoogleLoginButton onClick={() => login('google')} />
      </Space>
    </Card>
  )
}

export default observer(IntroLogin)
