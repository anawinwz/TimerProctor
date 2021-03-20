import styled from 'styled-components'
import { useEffect, useMemo } from 'react'
import { Typography, Button, Row, Col, Progress, Image } from 'antd'
import { ArrowLeftOutlined, StopOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import useAppTitle from '~/hooks/useAppTitle'

import { testerStatuses, testerTerminatableStatuses } from '~/utils/const'
import { dateStr } from '~/utils/date'

import ContentBox from '~/components/admin/ContentBox'
import ExamTesterTerminateModal from '~/components/admin/ExamTesterTerminateModal'
import UserTag from '~/components/admin/UserTag'
import CaptionedProgress from '~/components/admin/CaptionedProgress'
import SnapshotSequence from '~/components/admin/SnapshotSequence'
import TesterEventsTable from '~/components/admin/TesterEventsTable'
import { Link } from 'react-router-dom'

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
  const { ExamAdminStore: examAdmin, ExamStore: { info: exam } } = useStore()

  const testerId = match.params?.testerId

  useEffect(async () => {
    await examAdmin?.getTester(testerId)
    examAdmin?.getTester(testerId, 'snapshots')
    examAdmin?.getTester(testerId, 'events')
  }, [])

  const tester = examAdmin.testers[testerId]
  useAppTitle(tester ? `${tester?.name} - ${exam?.name}` : 'รายงานผู้เข้าสอบ')
  const [show, _, modal] = ExamTesterTerminateModal({
    testerId: testerId,
    testerName: tester?.name
  })

  const checker = useMemo(() => {
    const checker = tester?.idCheck?.checker
    return { 
      name: checker?.info?.displayName,
      email: checker?.email,
      avatar: checker?.info?.photoURL
    }
  }, [tester])

  const events = tester?.events || []

  const totalTime = exam.timer.duration * 60 * 1000
  const riskTimes = events
    .filter(event => !!event?.info?.timeDiff)
    .reduce((acc, event) => ({
      ...acc,
      [event.type]: (acc?.[event.type] || 0) + event.info.timeDiff,
      total: acc.total + event.info.timeDiff
    }), { total: 0 })

  if (!tester) return <></>
  return (
    <ContentBox>
      <Title level={3}><Link to="../"><ArrowLeftOutlined /></Link> { tester.name }</Title>
      <Button type="danger" icon={<StopOutlined />} onClick={show} disabled={!testerTerminatableStatuses.includes(tester.status)}>
        เชิญออก
      </Button>
      { modal }
      <TesterDescription align="middle">
        <Col xs={24} md={14}>
          <Row>
            <Col xs={24} md={6} className="text-center">
              <Progress type="circle" percent={100 - (riskTimes.total / totalTime * 100)} format={percent => `${percent.toFixed(2)}%`} />
              <SmallText className="text-center"></SmallText>
            </Col>
            <Col xs={24} md={18} style={{ paddingLeft: '10px' }}>
              <Subtitle type="secondary">สถานะ</Subtitle>
              <Title level={4}>{ testerStatuses[tester.status] }</Title>
              
              <CaptionedProgress percent={(riskTimes.face || 0) / totalTime * 100} strokeColor="#FFBE18">ไม่พบใบหน้า</CaptionedProgress>
              <CaptionedProgress percent={(riskTimes.window || 0) / totalTime * 100} strokeColor="#FFBE18">สลับแท็บ/หน้าต่าง</CaptionedProgress>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={10}>
          { 
            tester.idCheck.photoURL ?
            <Row>
              <Col span={12}>
                <Subtitle type="secondary">ภาพที่ใช้ยืนยันตน</Subtitle>
                <Image src={tester.idCheck.photoURL} width="90%" />
                <SmallText type="secondary">{ dateStr(tester.idCheck.timestamp, 'shortS') }</SmallText>
              </Col>
              <Col span={12}>
                <Subtitle type="secondary">ผู้อนุมัติการเข้าสอบ</Subtitle>
                { tester.idCheck.accepted && checker ? 
                  <>
                    <div><UserTag user={checker} /></div>
                    <SmallText type="secondary">{ dateStr(tester.idCheck.checkedAt, 'shortS') }</SmallText>
                  </> :
                  'ยังไม่มีผู้อนุมัติ'
                }
              </Col>
            </Row> :
            exam.isIDCheck ? 'ผู้เข้าสอบรายนี้ยังไม่เคยส่งภาพยืนยันตน' : 'การสอบนี้ไม่ต้องยืนยันตัวตน'
          }
        </Col>
      </TesterDescription>
      <Subtitle type="secondary">ภาพสุ่มบันทึกระหว่างการสอบ</Subtitle>
      <SnapshotSequence snapshots={tester.snapshots} />
      <TesterEventsTable events={tester.events} />
    </ContentBox>
  )
}

export default observer(ExamTesterReport)
