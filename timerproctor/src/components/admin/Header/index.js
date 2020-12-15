import { Layout, Row, Col } from 'antd'
import styled from 'styled-components'
import UserPopover from './UserPopover'

const HeaderBar = styled(Layout.Header)`
  padding-top: 0;
  padding-bottom: 0;
  background-color: white;
  .logo {
    font-weight: bold;
    font-size: 24px;
  }
`

const Header = () => (
  <HeaderBar>
    <Row justify="space-between">
      <Col><div className="logo">TimerProctor</div></Col>
      <Col>
        <UserPopover user={{ name: 'teacher@ku.th', role: { name: 'อาจารย์ผู้สอน' } }} />
      </Col>
    </Row>
  </HeaderBar>
)

export default Header
