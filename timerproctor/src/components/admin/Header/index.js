import { Layout, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '~/components/Logo'

import UserPopover from './UserPopover'

const HeaderBar = styled(Layout.Header)`
  padding-top: 0;
  padding-bottom: 0;
  background-color: white;
`

const Header = () => (
  <HeaderBar>
    <Row justify="space-between">
      <Col><Link to="/admin"><Logo /></Link></Col>
      <Col>
        <UserPopover />
      </Col>
    </Row>
  </HeaderBar>
)

export default Header
