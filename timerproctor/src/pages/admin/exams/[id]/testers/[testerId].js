import styled from 'styled-components'
import { useEffect } from 'react'
import { Typography, Button, Row, Col, Progress, Table, Image } from 'antd'
import { StopOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import ContentBox from '~/components/admin/ContentBox'
import { testerStatuses } from '~/utils/const'
import UserTag from '~/components/admin/UserTag'
import { shortDateStr } from '~/utils/date'
import CaptionedProgress from '~/components/admin/CaptionedProgress'

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
  }, [])

  
  const tester = examAdmin.testers[testerId]  
  return (
    <ContentBox>
      <Title level={3}>{ tester.name }</Title>
      <Button type="danger" icon={<StopOutlined />}>เชิญออก</Button>
      <TesterDescription align="middle">
        <Col span={14}>
          <Row>
            <Col span={6} className="text-center">
              <Progress type="circle" percent={100} format={percent => `${percent}%`} />
              <SmallText className="text-center">เวลาที่อยู่หน้ากล้อง</SmallText>
            </Col>
            <Col span={18} style={{ paddingLeft: '10px' }}>
              <Subtitle type="secondary">สถานะ</Subtitle>
              <Title level={4}>{ testerStatuses[tester.status] }</Title>
              
              <CaptionedProgress percent={0}>ไม่พบใบหน้า</CaptionedProgress>
              <CaptionedProgress percent={0}>สลับแท็บ/หน้าต่าง</CaptionedProgress>
            </Col>
          </Row>
        </Col>
        <Col span={10}>
          <Row>
            <Col span={12}>
              <Subtitle type="secondary">ภาพที่ใช้ยืนยันตัวบุคคล</Subtitle>
              <Image src={tester.idCheck.photoURL} width="90%" />
              <SmallText type="secondary">{ shortDateStr(tester.idCheck.timestamp) }</SmallText>
            </Col>
            <Col span={12}>
              <Subtitle type="secondary">ผู้อนุมัติการเข้าสอบ</Subtitle>
              <div><UserTag /></div>
              <SmallText type="secondary">{ shortDateStr(tester.idCheck.checkedAt) }</SmallText>
            </Col>
          </Row>
        </Col>
      </TesterDescription>
      <Table />
    </ContentBox>
  )
}

export default observer(ExamTesterReport)
