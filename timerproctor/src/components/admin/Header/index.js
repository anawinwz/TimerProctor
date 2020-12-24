import { Layout, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import UserPopover from './UserPopover'

const HeaderBar = styled(Layout.Header)`
  padding-top: 0;
  padding-bottom: 0;
  background-color: white;
  .logo {
    user-select: none;
    font-weight: bold;
    font-size: 24px;
    color: black;
  }
`

const Header = () => (
  <HeaderBar>
    <Row justify="space-between">
      <Col><Link className="logo" to="/admin">TimerProctor</Link></Col>
      <Col>
        <UserPopover user={{ name: 'teacher@ku.th', role: { name: 'อาจารย์ผู้สอน' } }} />
      </Col>
    </Row>
  </HeaderBar>
)

export default Header
