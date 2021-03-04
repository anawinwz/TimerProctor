import { useEffect, useState } from 'react'
import { List, Avatar } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import ExamProctorsListLoading from './loading/ExamProctorsList'

const ExamProctorsList = ({ addable = false }) => {
  const { ExamStore: exam, ExamAdminStore: examAdmin } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    setLoading(true)

    try {
      await examAdmin?.getProctors()
      setLoading(false)
    } catch {}
  }, [])

  const proctors = Object.entries(examAdmin.proctors)

  if (loading) return <ExamProctorsListLoading addable={addable} />
  return <>
    <List
      grid={{ column: 2 }}
      dataSource={proctors}
      renderItem={entry => {
        const [proctor, _id] = entry
        const { info, email, status } = proctor
        return (
          <List.Item key={_id}>
            <List.Item.Meta
              avatar={<Avatar src={info?.photoURL} size="large" />}
              title={info?.displayName || email}
              description={status}
            />
          </List.Item>
        )
      }}
    />
  </>
}

export default observer(ExamProctorsList)
