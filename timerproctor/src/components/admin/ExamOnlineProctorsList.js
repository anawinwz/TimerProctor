import { useEffect, useState } from 'react'
import { Avatar, Tooltip, message } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import UserAvatar from '~/components/admin/UserAvatar'

const ExamOnlineProctorsList = () => {
  const { ExamAdminStore: examAdmin } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    setLoading(true)

    try {
      await examAdmin?.getProctors()
      setLoading(false)
    } catch (err) {
      message.error(err.message)
    }
  }, [])


  if (loading) return <>กำลังโหลด...</>
  return (
    <Avatar.Group>
      {examAdmin.onlineProctors.map(([_id, proctor = {}]) => {
        const { info, email } = proctor
        const user = {
          name: info?.displayName,
          avatar: info?.photoURL,
          email: email
        }

        return (
          <Tooltip title={user.name}>
            <UserAvatar user={user} />
          </Tooltip>
        )
      })}
    </Avatar.Group>
  )
}

export default observer(ExamOnlineProctorsList)
