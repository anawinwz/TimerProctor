
import styled from 'styled-components'
import useFormattedTimer from '../../hooks/useFormattedTimer'
import { Card, Typography, Row, Col, Avatar, Progress } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import CenterContainer from '../CenterContainer'
const { Title } = Typography

const TimerProgress = styled(Progress)`
  position: absolute !important;
  left: 0;
`

const Header = () => {
  const initialTime = 50 * 60
  const { time, formattedTime } = useFormattedTimer({
    autostart: false,
    initialTime,
    timerType: 'DECREMENTAL',
  })

  return (
    <CenterContainer fixed style={{ zIndex: 99 }}>
      <Card size="small">
        <Title level={5} className="text-center">ข้อสอบกลางภาค วิชา มนุษย์กับทะเล</Title>
        <Row justify="space-between" align="middle">
          <Col xs={18} md={8}><Avatar icon={<UserOutlined />} /> name</Col>
          <Col span={6} className="text-center">{ formattedTime }</Col>
          <Col xs={0} md={8}></Col>
        </Row>
        <TimerProgress percent={time/initialTime * 100} showInfo={false} />
      </Card>
    </CenterContainer>
  )
}

export default Header
