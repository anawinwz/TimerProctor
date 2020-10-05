import { Card, Row, Col, Space, Button } from 'antd'
import { Google } from '../icons'

const IntroLogin = () => {
  return (
    <Card className="text-center">
      <p>โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
      
      <Space direction="vertical">
        <Button block icon={<span className="anticon"><Google /></span>}>เข้าสู่ระบบด้วย Google</Button>
        <Button block>OpenID: Kasetsart University</Button>
      </Space>
    </Card>
  )
}

export default IntroLogin
