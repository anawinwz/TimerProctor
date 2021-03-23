import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

const LogoutButton = () => {
  const { ExamStore: { id }, AuthStore: auth, SocketStore: socket, IDCheckStore: idCheck, AttemptStore: attempt } = useStore()
  const history = useHistory()

  const logoutAndReturn = useCallback(() => {
    auth.logout()
    attempt.reset()
    idCheck.reset()
    socket.destroy()
    history.replace(`/exams/${id}`)
  }, [id])

  return (
    <Button type="primary" onClick={logoutAndReturn}>
      ออกจากระบบ
    </Button>
  )
}

export default observer(LogoutButton)
