import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Space, Typography, message, Alert } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { getNextURL, removeNextURL } from '~/utils/redirect'

import Logo from '~/components/Logo'
import GoogleLoginButton from '~/components/buttons/GoogleLoginButton'

const IntroLogin = () => {
  const { AuthStore: auth } = useStore()
  
  const history = useHistory()
  const nextURL = getNextURL(history.location)

  const login = useCallback(async method => {
    try {
      await auth.doAuthen(method)

      if (nextURL) removeNextURL()
      history.replace(nextURL || '/admin/dashboard')
    } catch (err) {
      message.error(err.message)
    }
  }, [])

  
  return (
    <Card className="text-center">
      <Space direction="vertical">
        <Logo size="large" />
        <Typography.Title level={4}>ระบบจัดการการสอบ</Typography.Title>
        {nextURL && <Alert message="กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ" type="info" showIcon />}
        <GoogleLoginButton onClick={() => login('google')} />
      </Space>
    </Card>
  )
}

export default observer(IntroLogin)
