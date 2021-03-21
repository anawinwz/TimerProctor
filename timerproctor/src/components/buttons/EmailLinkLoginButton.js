import { Button } from 'antd'
import { MailOutlined } from '@ant-design/icons'

const EmailLinkLoginButton = (props) => (
  <Button {...props} block icon={<MailOutlined />}>
    เข้าสู่ระบบโดยรับลิงก์ทางอีเมล
  </Button>
)

export default EmailLinkLoginButton
