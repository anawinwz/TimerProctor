import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Space, Button, message } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import { APIFailedError } from '~/utils/api'
import { showModal } from '~/utils/modal'

import GoogleLoginButton from '~/components/buttons/GoogleLoginButton'

const IntroLogin = () => {
  const { ExamStore: exam, AuthStore: auth, AttemptStore: attempt } = useStore()
  const loginMethods = exam.info?.authentication?.login?.methods || []
  
  const history = useHistory()
  
  const dummyLogin = useCallback(() => {
    auth.setUser({ userId: '1234', displayName: 'anawin' })
    history.replace(`/exams/${exam.id}/authenticate`)
  }, [history])

  const login = useCallback(async method => {
    try {
      await auth.doAuthen(method)
      
      try {
        await attempt.getAttempt()
        history.replace(`/exams/${exam.id}/authenticate`)
      } catch (err) {
        if (err instanceof APIFailedError) {
          showModal('error', 'ไม่สามารถขอเข้าสู่การสอบได้', err.message)
        } else {
          throw err
        }
      }
    } catch (err) {
      message.error(err.message)
    }
  }, [])


  return (
    <Card className="text-center">
      {
        loginMethods.length > 0 ?
        <>
          <p>โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          
          <Space direction="vertical">
            {loginMethods?.map(method => {
              const key = `login-${method}`
              switch (method) {
                case 'google':
                  return <GoogleLoginButton key={key} onClick={() => login('google')} />
                case 'sso':
                  return <Button key={key} onClick={dummyLogin} block>Single Sign-On</Button>
              }
            })}
          </Space>
        </> :
        <>
          <p>กรุณาเตรียมตัวให้พร้อมและเข้าสู่การสอบ</p>
          <Space direction="vertical">
            <Button onClick={dummyLogin} block>เข้าสู่การสอบ</Button>
          </Space>
        </>
      }
    </Card>
  )
}

export default observer(IntroLogin)
