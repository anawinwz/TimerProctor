import { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { showModal } from '~/utils/modal'

import ExamSettingsPage from './[id]/settings'
import ExamOverviewPage from './[id]/overview'
import ExamTesterPage from './[id]/testers/[testerId]'

const AdminExamPage = ({ match }) => {
  const { ExamStore: exam, ExamAdminStore: examAdmin, SocketStore: socketStore } = useStore()

  useEffect(async () => {
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
          .on('examStatus', payload => exam.updateStatus(payload))
          .on('newTester', tester => examAdmin.addTester(tester))
          .on('testerStatus', payload => {
            const { id, status } = payload
            examAdmin.updateTester(id, { status })
          })
          .on('idCheckRequest', payload => {
            const { id, socketId, photoURL, timestamp } = payload
            examAdmin.updateTester(id, {
              status: 'authenticating',
              socketId: socketId,
              idCheck: {
                photoURL: photoURL,
                timestamp: timestamp
              },
              checkedByMe: undefined
            })
          })
          .on('newSnapshot', payload => {
            const { id, url } = payload
            examAdmin.updateTester(id, {
              lastSnapshot: { url: url }
            })
          })
          .on('connect', () => socketStore.socket.emit('authenticate', { token: examAdmin.socketToken }))
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
      <Route exact path={match.url + '/testers/:testerId'} component={ExamTesterPage} />
    </Switch>
  )
}

export default observer(AdminExamPage)
