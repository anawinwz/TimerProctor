import { useCallback } from 'react'
import { Card, Space,Button } from 'antd'
import { Google } from '../icons'

const IntroLogin = ({ loginMethods }) => {
  // const login = useCallback(() => {
  //   router.replace(`/exams/${id}/authenticate`)
  // }, [router])

  return (
    <Card className="text-center">
      <p>โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
      
      <Space direction="vertical">
        {loginMethods?.map(item => {
          switch (item.method) {
            case 'google': return <Button onClick={login} block icon={<span className="anticon"><Google /></span>}>เข้าสู่ระบบด้วย Google</Button>
            case 'openid': return <Button onClick={login} block>OpenID: Kasetsart University</Button>
          }
        })}
      </Space>
    </Card>
  )
}

export default IntroLogin
