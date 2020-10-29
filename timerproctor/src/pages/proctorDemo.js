import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Badge, Empty, message, Tabs, Card, Space, Button, Popconfirm, Radio, Typography } from 'antd'
import { useCallback, useState, useEffect } from 'react'
import DefaultLayout from '../layouts/default.js'
import { fetchAPI } from '../utils/api.js'

const { TabPane } = Tabs
const { Title } = Typography

const reasons = ['รูปไม่ชัดเจน', 'ประเภทบัตรไม่ถูกต้อง', 'บุคคลในภาพและในบัตรไม่ตรง']
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

const RejectReasonRadios = ({ currentReason, setReason }) => {
  const onChange = useCallback((e) => setReason(e.target.value), [setReason])
  return (
    <Radio.Group onChange={onChange} value={currentReason}>
      {reasons.map((text) =>
        <Radio style={radioStyle} value={text} key={text}>
          {text}
        </Radio>
      )}
    </Radio.Group>
  )
}

const IDCardRequestItem = ({ item, responseUser }) => {
  const [reason, setReason] = useState('รูปไม่ชัดเจน')

  return (
    <Space direction="vertical">
      <img src={item.imageURL} width="100%" />
      <Title key={3}>userId {item.userId}</Title>
      <Space direction="horizontal">
        <Button type="primary" icon={<CheckOutlined />} onClick={() => responseUser(item.userId, 'approve')}>ยอมรับ</Button>
        <Popconfirm
          title={<RejectReasonRadios currentReason={reason} setReason={setReason} />}
          onConfirm={() => responseUser(item.userId, 'reject', reason)}
          okText="ดำเนินการต่อ"
          cancelText="ยกเลิก"
        >
          <Button type="danger" icon={<CloseOutlined />}>ปฏิเสธ</Button>
        </Popconfirm>
      </Space>
    </Space>

  )
}

const ProctorDemoPage = () => {
  const [ws, setWS] = useState(null)
  const [waitingList, setWaitingList] = useState([])

  useEffect(() => {
    try {
      const tempWs = new WebSocket('ws://localhost:5000/proctor')
      tempWs.onmessage = (evt) => {
        const data = JSON.parse(evt?.data) || {}
        const { type, payload }  = data
        console.log(type, payload)

        if (!type) return false
        switch (type) {
          case 'newIdCheckReq':
            setWaitingList(prevState => ([...prevState, payload]))
            break
        }
      }
      setWS(tempWs)
    } catch {
      setWS(null)
    }
  
    return () => {
      if (ws) ws.close()
      setWS(null)
    }
  }, [])

  const responseUser = useCallback(async (id, mode, reason) => {
    try {
      await fetchAPI(`/users/${id}/${mode}`, mode === 'reject' ? { reason } : {})
      message.success(`แจ้งผลการ ${mode} แก่ ${id} เรียบร้อยแล้ว!`)
      setWaitingList(prevState => prevState.slice(1))
    } catch (err) {
      message.error(`เกิดข้อผิดพลาด: ${err.message}`)
    }
  }, [])

  return (
    <DefaultLayout>
      <Title key={2} className="text-center">Proctor Demo</Title>
      <Card>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab={<>รออนุมัติ <Badge count={waitingList.length} showZero /></>} key="1">
            { waitingList.length === 0 && <Empty /> }
            { waitingList.length > 0 && <IDCardRequestItem item={waitingList[0]} responseUser={responseUser} /> }
          </TabPane>
        </Tabs>
      </Card>
    </DefaultLayout>
  )
}

export default ProctorDemoPage
