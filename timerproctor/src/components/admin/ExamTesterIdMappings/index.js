import { useEffect, useState } from 'react'
import { message, Table } from 'antd'

import { useStore } from '~/stores/admin'
import { observer } from 'mobx-react-lite'

import ImportModal from './ImportModal'
import DeleteButton from './DeleteButton'

const columns = [
  { title: 'อีเมล', dataIndex: 'email', width: '60%' },
  { title: 'รหัสประจำตัวผู้เข้าสอบ', dataIndex: 'testerId' }
]

const ExamTesterIdMappings = () => {
  const { ExamAdminStore: examAdmin } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    setLoading(true)
    try {
      await examAdmin?.getTesterIdMappings()
      setLoading(false)
    } catch (err) {
      message.error(err.message)
    }
  }, [])

  return (
    <>
      <ImportModal disabled={!examAdmin.isExamOwner} />
      <DeleteButton disabled={!examAdmin.isExamOwner} />
      <Table
        size="small"
        loading={loading}
        columns={columns}
        dataSource={examAdmin.testerIdMappings}
      />
    </>
  )
}

export default observer(ExamTesterIdMappings)
