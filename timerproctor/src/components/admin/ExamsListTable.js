import { Table } from 'antd'
import { Link } from 'react-router-dom'

import StatusTag from './StatusTag'

import demoExam from '../../assets/demoExam.json'
const demoExams = [ demoExam, { ...demoExam, status: 'unset' } ]

const columns = [
  {
    title: 'ชื่อ',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    render: (name, exam) => <Link to={`/admin/exams/${exam._id}/${exam.status === 'unset' ? 'settings' : 'overview'}`}>{name}</Link>,
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
    render: (timeWindow, exam) => {
      if (exam.status === 'unset' || !timeWindow) return '-'
      if (timeWindow.mode === 'realtime') return 'ตามเวลาจริง'
      return timeWindow.schedule?.startDate
    },
  },
  {
    title: <>จำนวนผู้เข้าสอบ<br />(ทั้งหมด / ส่งแล้ว / ยังไม่เสร็จ)</>,
    dataIndex: 'participants',
    key: 'participants',
    render: (participants, exam) => exam.status === 'unset' ? '-' : `0 / 0 / 0`
  },
  {
    title: 'แก้ไขล่าสุดเมื่อ',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (updatedAt, exam) => updatedAt || exam.createdAt
  },
]

const TestsListTable = ({ pageSize = 5 }) => {
  return (
    <Table
      size="middle"
      columns={columns}
      dataSource={demoExams}
      pagination={{ 
        position: ['bottomRight'],
        pageSize: pageSize,
      }}
    />
  )
}

export default TestsListTable
