import { Table } from 'antd'
import ExamTesterIdMappingsImport from './ExamTesterIdMappingsImport'

const columns = [
  { title: 'อีเมล', dataIndex: 'email', width: '60%' },
  { title: 'รหัสประจำตัวผู้เข้าสอบ', dataIndex: 'testerId' }
]

const ExamTesterIdMappingsList = () => {
  return (
    <>
      <ExamTesterIdMappingsImport />
      <Table
        columns={columns}
      />
    </>
  )
}

export default ExamTesterIdMappingsList
