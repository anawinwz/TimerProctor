import { Table } from 'antd'
import ExamTesterIDMappingsImport from './ExamTesterIDMappingsImport'

const columns = [
  { title: 'อีเมล', dataIndex: 'email', width: '60%' },
  { title: 'รหัสประจำตัวผู้เข้าสอบ', dataIndex: 'testerId' }
]

const ExamTesterIDMappingsList = () => {
  return (
    <>
      <ExamTesterIDMappingsImport />
      <Table
        columns={columns}
      />
    </>
  )
}

export default ExamTesterIDMappingsList
