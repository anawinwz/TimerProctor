import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

const LogoutButton = () => {
  const { ExamStore: { id }, AuthStore: { logout } } = useStore()
  const history = useHistory()

  const logoutAndReturn = useCallback(() => {
    logout()
    history.replace(`/exams/${id}`)
  }, [id, logout])

  return (
    <Button type="primary" onClick={logoutAndReturn}>
      ออกจากระบบ
    </Button>
  )
}

export default observer(LogoutButton)
