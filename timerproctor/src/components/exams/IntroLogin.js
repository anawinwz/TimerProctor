import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStore } from '../../stores'
import { Card, Space,Button } from 'antd'
import { Google } from '../icons'

const IntroLogin = () => {
  const { ExamStore: exam } = useStore()
  const loginMethods = exam.info?.authentication?.loginMethods || []
  
  const history = useHistory()
  const login = useCallback(() => {
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
              switch (item.method) {
                case 'google': return <Button onClick={login} block icon={<span className="anticon"><Google /></span>}>เข้าสู่ระบบด้วย Google</Button>
                case 'openid': return <Button onClick={login} block>OpenID: Kasetsart University</Button>
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
