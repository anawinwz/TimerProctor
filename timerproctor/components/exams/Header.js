import { Card, Typography, Row, Col, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
const { Title } = Typography

const Header = () => (
  <Card size="small">
    <Title level={5} className="text-center">ข้อสอบกลางภาค วิชา มนุษย์กับทะเล</Title>
    <Row justify="space-between" align="middle">
      <Col span={4}><Avatar icon={<UserOutlined />} /> name</Col>
      <Col span={4} className="text-center">--:--</Col>
      <Col span={4}></Col>
    </Row>
  </Card>
)

export default Header
