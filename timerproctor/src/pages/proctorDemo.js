import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, SendOutlined } from '@ant-design/icons'
import { Modal, List, Badge, Empty, message, Tabs, Card, Space, Button, Popconfirm, Radio, Typography, Input, InputNumber, Form } from 'antd'
import { useCallback, useState, useEffect } from 'react'
import DefaultLayout from '../layouts/default.js'
import { fetchAPI } from '../utils/api.js'

const { TabPane } = Tabs
const { Title } = Typography
const { TextArea } = Input

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
    <Space direction="vertical" className="text-center" style={{ display: 'block' }}>
      <img src={item.imageURL} width="100%" style={{ maxWidth: '360px' }} />
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

  const examId = `5f991c780953aa4110686e76`
  const [annouce, setAnnouce] = useState('')
  const [pastAnnouce, setPastAnnouce] = useState([])
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

  const updateExam = useCallback(async (data) => {
    console.log(data)
    try {
      await fetchAPI(`/exams/${examId}/update`, data)
      message.success(`อัปเดตข้อมูลการสอบเรียบร้อยแล้ว!`)
    } catch (err) {
      message.error(`เกิดข้อผิดพลาด: ${err.message}`)
    }
  }, [examId])

  const controlExam = useCallback(async (mode) => {
    try {
      await fetchAPI(`/exams/${examId}/${mode}`)
      message.success(`สั่ง ${mode} การสอบเรียบร้อยแล้ว!`)
    } catch (err) {
      message.error(`เกิดข้อผิดพลาด: ${err.message}`)
    }
  }, [examId])

  const stopExam = useCallback(() => {
    Modal.confirm({
      title: 'คุณแน่ใจหรือว่าต้องการสิ้นสุดการสอบ?',
      icon: <ExclamationCircleOutlined />,
      content: 'ผู้เข้าสอบที่เหลืออยู่จะไม่สามารถส่งคำตอบได้',
      onOk() {
        controlExam('stop')
      },
      onCancel() {}
    })
  }, [])

  const onTextChange = useCallback((e) => {
    setAnnouce(e.target.value)
  }, [])

  const sendAnnouce = useCallback(async () => {
    if (!annouce) {
      return message.error('กรุณากรอกเนื้อหาประกาศก่อน!')
    }
    try {
      await fetchAPI(`/exams/demo/annoucement`, { text: annouce })
      message.success(`ประกาศเรียบร้อยแล้ว!`)
      setAnnouce('')
      setPastAnnouce(prevState => [...prevState, annouce])
    } catch (err) {
      message.error(`เกิดข้อผิดพลาด: ${err.message}`)
    }
  }, [annouce])

  return (
    <DefaultLayout>
      <Title level={2} className="text-center">Proctor Demo</Title>
      <Card style={{ minHeight: '90vh' }}>
        <p>
          <Button type="primary" onClick={() => controlExam('start')}>เริ่มการสอบ</Button>
          <Button type="danger" onClick={stopExam}>หยุดการสอบ</Button>
        </p>
        <Title level={5}>Demo ตั้งค่า</Title>
        <Form
          layout="horizontal"
          size="default"
          onFinish={updateExam}
        >
          <Form.Item label="จำกัดเวลาทำ (นาที)" name={['timer', 'duration']} initialValue={50}>
            <InputNumber />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              อัปเดต
            </Button>
          </Form.Item>
        </Form>
        <Title level={5}>Demo ประกาศถึงผู้เข้าสอบ</Title>
        <List
          locale={{emptyText: 'ประวัติการส่งจะปรากฏที่นี่' }}
          dataSource={pastAnnouce.slice(-2)}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
        <TextArea placeholder="เนื้อหาประกาศถึงผู้เข้าสอบ" value={annouce} onChange={onTextChange} />
        <Button block icon={<SendOutlined />} onClick={sendAnnouce}>ส่งประกาศ</Button>
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
