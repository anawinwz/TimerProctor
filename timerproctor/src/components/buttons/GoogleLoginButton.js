import { Button } from 'antd'
import { Google } from '~/components/icons'

const GoogleLoginButton = (props) => (
  <Button {...props} block icon={<span className="anticon"><Google /></span>}>
    เข้าสู่ระบบด้วย Google
  </Button>
)

export default GoogleLoginButton
