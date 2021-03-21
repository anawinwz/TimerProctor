import { useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Space, Typography, Divider, message, Alert, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { showModal } from '~/utils/modal'
import { getNextURL, removeNextURL } from '~/utils/redirect'

import Logo from '~/components/Logo'
import GoogleLoginButton from '~/components/buttons/GoogleLoginButton'
import EmailLinkLoginButton from '~/components/buttons/EmailLinkLoginButton'

const IntroLogin = () => {
  const { AuthStore: auth } = useStore()
  
  const history = useHistory()
  const nextURL = getNextURL(history.location)

  const removeEmailParams = useCallback(() => {
    const q = new URLSearchParams(history.location.search)
    q.delete('apiKey')
    q.delete('oobCode')
    q.delete('mode')
    q.delete('lang')
    history.replace({ search: q.toString() })
  }, [])

  const enterDashboard = result => {
    if (result === true) {
      if (nextURL) removeNextURL()
      history.replace(nextURL || '/admin/dashboard')
    } else if (result?.message) {
      showModal('info', 'ข้อความ', result.message, {
        onOk: result?.onOk || (() => {})
      })
    }
  }

  useEffect(async () => {
    try {
      const result = await auth.doEmailCallback()
      removeEmailParams()
      enterDashboard(result)
    } catch (err) {
      removeEmailParams()
      message.error(err.message)
    }
  }, [])

  const login = useCallback(async method => {
    try {
      const result = await auth.doAuthen(method)
      enterDashboard(result)
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
        <Spin
          spinning={auth.loggingIn}
          tip={auth.emailLoggingIn ? `กำลังเข้าสู่ระบบด้วยอีเมล ${auth.emailLoggingIn}...` : 'กำลังเข้าสู่ระบบ...'}
        >
          <GoogleLoginButton onClick={() => login('google')} />
          <Divider>หรือ</Divider>
          <EmailLinkLoginButton onClick={() => login('email')} />
          <Typography.Text type="secondary">สำหรับกรรมการคุมสอบที่ไม่ได้ใช้บัญชี Google</Typography.Text>
        </Spin>
      </Space>
    </Card>
  )
}

export default observer(IntroLogin)
