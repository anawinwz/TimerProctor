import { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'
import { message } from 'antd'

import { showModal } from '~/utils/modal'

import Loading from '~/components/exams/Loading'
import Error from '~/components/exams/Error'
import NotFound from '~/components/exams/NotFound'

import ExamPage from './[id]/index'
import ExamSettingsPage from './[id]/settings'
import ExamOverviewPage from './[id]/overview'
import ExamTesterPage from './[id]/testers/[testerId]'

const AdminExamPage = ({ match }) => {
  const { ExamStore: exam, ExamAdminStore: examAdmin, SocketStore: socketStore } = useStore()

  useEffect(async () => {
    exam.clearInfo()
    try {
      await exam.getInfo({ id: match.params.id })
      examAdmin.clearInfo()
      await examAdmin.startProctor()
    } catch {}
  }, [match.params.id])

  useEffect(() => {
    let hideSocketLoading
    if (examAdmin.socketToken && examAdmin.lastExamId === exam.id) {
      hideSocketLoading = message.loading('กำลังเชื่อมต่อเซิร์ฟเวอร์คุมสอบ...')
      try {
        socketStore.init(`/exams/${exam.id}`)
          .on('authenticated', () => {
            if (typeof hideSocketLoading === 'function') hideSocketLoading()
          })
          .on('unauthorized', error => {
            throw error
          })
          .on('examStatus', payload => exam.updateStatus(payload))
          .on('examAllowLogin', payload => examAdmin.updateAllowLogin(payload))
          .on('newTester', tester => examAdmin.addLocalTester(tester))
          .on('testerUpdate', payload => {
            const { id, updates } = payload
            examAdmin.updateLocalTester(id, updates, true)
          })
          .on('idCheckRequest', payload => {
            const { id, socketId, photoURL, timestamp } = payload
            examAdmin.updateLocalTester(id, {
              status: 'authenticating',
              socketId: socketId,
              idCheck: {
                photoURL: photoURL,
                timestamp: timestamp
              }
            }, true)
          })
          .on('newSnapshot', payload => {
            const { id, url, timestamp } = payload
            const snapshot = { url: url, timestamp: timestamp }
            examAdmin.updateLocalTester(id, {
              lastSnapshot: snapshot
            }, true)
            examAdmin.addSnapshotToLocalTester(id, snapshot)
          })
          .on('newEvent', payload => {
            const { id, event } = payload
            examAdmin.addEventToLocalTester(id, event)
          })
          .on('connect', () => socketStore.socket.emit('authenticate', { token: examAdmin.socketToken }))
          .connect()
      } catch {
        showModal('error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์คุมสอบได้', 'กรุณาลองใหม่อีกครั้ง')
      }
    }
    return () => {
      if (typeof hideSocketLoading === 'function') hideSocketLoading() 
      socketStore.destroy()
    }
  }, [examAdmin.socketToken, exam.id])

  if (exam.loading) return <Loading />
  else if (exam.error) return <Error />
  else if (!exam.info.name) return <NotFound />
  return (
    <Switch>
      <Route exact path={match.url + '/'} component={ExamPage} />
      <Route exact path={match.url + '/settings'} component={ExamSettingsPage} />
      <Route exact path={match.url + '/overview'} component={ExamOverviewPage} />
      <Route exact path={match.url + '/testers/:testerId'} component={ExamTesterPage} />
    </Switch>
  )
}

export default observer(AdminExamPage)
