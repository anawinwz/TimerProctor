
import styled from 'styled-components'
import useFormattedTimer from '../../hooks/useFormattedTimer'
import { Card, Typography, Row, Col, Avatar, Progress } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import CenterContainer from '../CenterContainer'
import { observer } from 'mobx-react'
import { useStore } from '../../stores'
const { Title } = Typography

const TimerProgress = styled(Progress)`
  position: absolute !important;
  left: 0;
`

const Header = ({ fixed = true }) => {
  const { ExamStore: exam, AuthStore: auth, TimerStore: timer } = useStore()
  
  const totalTime = timer.endTime
  const time = timer.remainingTime
  const formattedTime = timer.displayRemainingTime
  const timePercent = exam.status === 'started' ? time/totalTime * 100 : 0

  return (
    <CenterContainer fixed={fixed} style={{ zIndex: 99, top: 0 }}>
      <Card size="small">
        <Title level={5} className="text-center">{ exam.info.name }</Title>
        <Row justify="space-between" align="middle">
          <Col xs={18} md={8}><Avatar icon={<UserOutlined />} src={auth.photoURL} /> { auth.displayName }</Col>
          <Col span={6} className="text-center">{ formattedTime }</Col>
          <Col xs={0} md={8}></Col>
        </Row>
        <TimerProgress percent={timePercent} showInfo={false} />
      </Card>
    </CenterContainer>
  )
}

export default observer(Header)
