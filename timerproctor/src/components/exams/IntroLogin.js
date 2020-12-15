import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStore } from '../../stores'
import { Card, Space, Button } from 'antd'

import GoogleLoginButton from '../buttons/GoogleLoginButton'

const IntroLogin = () => {
  const { ExamStore: exam, AuthStore: auth } = useStore()
  const loginMethods = exam.info?.authentication?.loginMethods || []
  
  const history = useHistory()
  const login = useCallback(() => {
    auth.setUser({ userId: '1234', displayName: 'anawin' })
    history.replace(`/exams/${exam.id}/authenticate`)
  }, [history])


  return (
    <Card className="text-center">
      {
        loginMethods.length > 0 ?
        <>
          <p>โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          
          <Space direction="vertical">
            {loginMethods?.map(item => {
              const key = `login-${item.method}`
              switch (item.method) {
                case 'google':
                  return <GoogleLoginButton key={key} onClick={login} />
                case 'openid':
                  return <Button key={key} onClick={login} block>OpenID: Kasetsart University</Button>
              }
            })}
          </Space>
        </> :
        <>
          <p>กรุณาเตรียมตัวให้พร้อมและเข้าสู่การสอบ</p>
          <Space direction="vertical">
            <Button onClick={login} block>เข้าสู่การสอบ</Button>
          </Space>
        </>
      }
    </Card>
  )
}

export default observer(IntroLogin)
