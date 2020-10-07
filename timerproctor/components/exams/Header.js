
import styled from 'styled-components'
import { Card, Typography, Row, Col, Avatar, Progress } from 'antd'
import { UserOutlined } from '@ant-design/icons'
const { Title } = Typography

const TimerProgress = styled(Progress)`
  position: absolute !important;
  left: 0;
`

const Header = () => (
  <Card size="small">
    <Title level={5} className="text-center">ข้อสอบกลางภาค วิชา มนุษย์กับทะเล</Title>
    <Row justify="space-between" align="middle">
      <Col xs={18} md={8}><Avatar icon={<UserOutlined />} /> name</Col>
      <Col span={6} className="text-center">--:--</Col>
      <Col xs={0} md={8}></Col>
    </Row>
    <TimerProgress percent={0} showInfo={false} />
  </Card>
)

export default Header
