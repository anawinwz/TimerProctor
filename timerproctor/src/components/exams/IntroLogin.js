import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStore } from '../../stores'
import { Card, Space, Button, message } from 'antd'

import GoogleLoginButton from '../buttons/GoogleLoginButton'

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
      await attempt.getAttempt()
      history.replace(`/exams/${exam.id}/authenticate`)
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
                case 'openid':
                  return <Button key={key} onClick={dummyLogin} block>OpenID: Kasetsart University</Button>
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
