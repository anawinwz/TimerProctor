import { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { showModal } from '~/utils/modal'

import ExamSettingsPage from './[id]/settings'
import ExamOverviewPage from './[id]/overview'

const AdminExamPage = ({ match }) => {
  const { ExamStore: exam, ExamAdminStore: examAdmin, SocketStore: socketStore } = useStore()

  useEffect(() => {
    await exam.getInfo({ id: match.params?.id })
    await examAdmin.startProctor()
  }, [match.params?.id])

  useEffect(() => {
    if (examAdmin.socketToken) {
      try {
        socketStore.init(`/exams/${exam.id}`)
          .on('authenticated', () => {})
          .on('unauthorized', error => {
            throw error
          })
          .connect()
      } catch {
        showModal('error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์คุมสอบได้', 'กรุณาลองใหม่อีกครั้ง')
      }
    }
    return () => {
      socketStore.destroy()
    }
  }, [examAdmin.socketToken])

  return (
    <Switch>
      <Route exact path={match.url + '/settings'} component={ExamSettingsPage} />
      <Route exact path={match.url + '/overview'} component={ExamOverviewPage} />
    </Switch>
  )
}

export default observer(AdminExamPage)
