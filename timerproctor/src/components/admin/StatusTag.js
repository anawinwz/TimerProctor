import { Tag } from 'antd'

const statuses = {
  'unset': {
    name: 'ยังไม่ได้ตั้งค่า',
    color: 'gold',
  },
  'ready': {
    name: 'ยังไม่เริ่ม',
  },
  'started': {
    name: 'กำลังดำเนินการสอบ',
    color: 'geekblue',
  },
  'stopped': {
    name: 'สิ้นสุดแล้ว',
    color: 'red',
  },
}

const StatusTag = ({ status }) => {
  const { name, color } = statuses[status]
  return <Tag color={color} key={name}>
    { name }
  </Tag>
}

export default StatusTag
