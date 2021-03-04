import { useEffect, useState } from 'react'
import { List, Avatar } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { fetchAPIwithAdminToken } from '~/utils/api'

import ExamProctorsListLoading from './loading/ExamProctorsList'

const ExamProctorsList = ({ addable = false }) => {
  const { ExamStore: exam } = useStore()
  const [loading, setLoading] = useState(true)
  const [proctors, setProctors] = useState([])

  useEffect(async () => {
    setLoading(true)

    try {
      const res = await fetchAPIwithAdminToken(`/exams/${exam.id}/proctors`)
      const { status, payload } = res
      if (status === 'ok') {
        setProctors(payload.proctors)
        setLoading(false)
      }
    } catch {}
  }, [])

  if (loading) return <ExamProctorsListLoading addable={addable} />
  return <>
    <List
      grid={{ column: 2 }}
      dataSource={proctors}
      renderItem={proctor => {
        const { user, status } = proctor
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={user?.info?.photoURL} size="large" />}
              title={user?.info?.displayName || user?.email}
              description={status}
            />
          </List.Item>
        )
      }}
    />
  </>
}

export default observer(ExamProctorsList)
