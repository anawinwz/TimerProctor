import styled from 'styled-components'
import { useEffect, useMemo } from 'react'
import { Typography, Button, Row, Col, Progress, Table, Image } from 'antd'
import { StopOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { testerStatuses } from '~/utils/const'
import { dateStr } from '~/utils/date'

import ContentBox from '~/components/admin/ContentBox'
import UserTag from '~/components/admin/UserTag'
import CaptionedProgress from '~/components/admin/CaptionedProgress'
import TesterEventsTable from '~/components/admin/TesterEventsTable'

const Title = styled(Typography.Title)`
  margin-top: 0 !important;
`
const Subtitle = styled(Typography.Text)`
  display: block;
  margin-bottom: 5px;
`
const TesterDescription = styled(Row)`
  margin-top: 20px;
  margin-bottom: 20px;
`
const SmallText = styled(Typography.Text)`
  display: block;
  font-size: 12px;
`

const ExamTesterReport = ({ match }) => {
  const { ExamAdminStore: examAdmin } = useStore()

  const testerId = match.params?.testerId

  useEffect(async () => {
    examAdmin?.getTester(testerId)
    examAdmin?.getTester(testerId, 'events')
  }, [])

  const tester = examAdmin.testers[testerId]

  const checker = useMemo(() => ({
    name: tester?.idCheck?.checker?.info?.displayName,
    email: tester?.idCheck?.checker?.info?.email,
    avatar: tester?.idCheck?.checker?.info?.photoURL
  }), [tester])

  if (!tester) return <></>
  return (
    <ContentBox>
      <Title level={3}>{ tester.name }</Title>
      <Button type="danger" icon={<StopOutlined />}>เชิญออก</Button>
      <TesterDescription align="middle">
        <Col span={14}>
          <Row>
            <Col span={6} className="text-center">
              <Progress type="circle" percent={93} format={percent => `${percent}%`} />
              <SmallText className="text-center"></SmallText>
            </Col>
            <Col span={18} style={{ paddingLeft: '10px' }}>
              <Subtitle type="secondary">สถานะ</Subtitle>
              <Title level={4}>{ testerStatuses[tester.status] }</Title>
              
              <CaptionedProgress percent={0} strokeColor="#FFBE18">ไม่พบใบหน้า</CaptionedProgress>
              <CaptionedProgress percent={7} strokeColor="#FFBE18">สลับแท็บ/หน้าต่าง</CaptionedProgress>
            </Col>
          </Row>
        </Col>
        <Col span={10}>
          <Row>
            <Col span={12}>
              <Subtitle type="secondary">ภาพที่ใช้ยืนยันตัวบุคคล</Subtitle>
              <Image src={tester.idCheck.photoURL} width="90%" />
              <SmallText type="secondary">{ dateStr(tester.idCheck.timestamp, 'shortS') }</SmallText>
            </Col>
            <Col span={12}>
              <Subtitle type="secondary">ผู้อนุมัติการเข้าสอบ</Subtitle>
              <div><UserTag user={checker} /></div>
              <SmallText type="secondary">{ dateStr(tester.idCheck.checkedAt, 'shortS') }</SmallText>
            </Col>
          </Row>
        </Col>
      </TesterDescription>
      <TesterEventsTable events={tester.events} />
    </ContentBox>
  )
}

export default observer(ExamTesterReport)
