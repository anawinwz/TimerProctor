import { useCallback, useState } from 'react'
import { Empty, Space, Typography, Button, Popconfirm, Radio, Image } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'

import { photoRejectReasons } from '~/utils/const'

const { Title } = Typography
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

const RejectReasonRadios = ({ currentReason, setReason }) => {
  const onChange = useCallback(e => setReason(e.target.value), [setReason])
  return (
    <Radio.Group onChange={onChange} value={currentReason}>
      {photoRejectReasons.map(reason =>
        <Radio style={radioStyle} value={reason} key={reason}>
          { reason }
        </Radio>
      )}
    </Radio.Group>
  )
}

const ApproveView = ({ testers = [] }) => {
  const [reason, setReason] = useState('รูปไม่ชัดเจน')
  const responseUser = useCallback((userId, mode, reason) => {
    console.log(userId, mode, reason)
  }, [])

  if (testers.length === 0) return <Empty />
  
  const item = testers[0]
  return (
    <Space direction="vertical" className="text-center" style={{ display: 'block' }}>
      <Image src={item.idCheck?.photoURL} width="100%" style={{ maxWidth: '360px' }} />
      <Title key={3}>{ item.name }</Title>
      <Space direction="horizontal">
        <Button type="primary" icon={<CheckOutlined />} onClick={() => responseUser(item._id, 'approve')}>อนุมัติ</Button>
        <Popconfirm
          title={<RejectReasonRadios currentReason={reason} setReason={setReason} />}
          onConfirm={() => responseUser(item._id, 'reject', reason)}
          okText="ดำเนินการต่อ"
          cancelText="ยกเลิก"
        >
          <Button type="danger" icon={<CloseOutlined />}>ปฏิเสธ</Button>
        </Popconfirm>
      </Space>
    </Space>
  )
}

export default observer(ApproveView)
