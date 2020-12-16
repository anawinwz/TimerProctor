import { Table } from 'antd'

import StatusTag from './StatusTag'

const columns = [
  {
    title: 'ชื่อ',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    render: text => <a>{text}</a>,
  },
  {
    title: 'สถานะ',
    key: 'status',
    dataIndex: 'status',
    render: status => <StatusTag status={status} />,
  },
  {
    title: 'กำหนดสอบ',
    dataIndex: 'timeWindow',
    key: 'timeWindow',
    render: timeWindow => {
      if (!timeWindow) return '-'
      if (timeWindow.mode === 'realtime') return 'ตามเวลาจริง'
      return timeWindow.schedule?.startDate
    },
  },
  {
    title: <>จำนวนผู้เข้าสอบ<br />(ทั้งหมด / ส่งแล้ว / ยังไม่เสร็จ)</>,
    dataIndex: 'participants',
    key: 'participants',
    render: participants => `0 / 0 / 0`
  },
  {
    title: 'แก้ไขล่าสุดเมื่อ',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: updatedAt => updatedAt
  },
]

const TestsListTable = ({ pageSize = 5 }) => {
  return (
    <Table
      size="middle"
      columns={columns}
      pagination={{ 
        position: ['bottomRight'],
        pageSize: pageSize,
      }}
    />
  )
}

export default TestsListTable