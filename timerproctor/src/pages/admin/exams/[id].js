import { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { message } from 'antd'
import { useStore } from '~/stores/admin'

import { showModal } from '~/utils/modal'

import Loading from '~/components/exams/Loading'
import Error from '~/components/exams/Error'
import NotFound from '~/components/exams/NotFound'

import ExamSettingsPage from './[id]/settings'
import ExamOverviewPage from './[id]/overview'
import ExamTesterPage from './[id]/testers/[testerId]'

const AdminExamPage = ({ match }) => {
  const { ExamStore: exam, ExamAdminStore: examAdmin, SocketStore: socketStore } = useStore()
  const [socketLoading, setSocketLoading] = useState(false)

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
    if (examAdmin.socketToken) {
      hideSocketLoading = message.loading('กำลังเชื่อมต่อเซิร์ฟเวอร์คุมสอบ...')
      try {
        setSocketLoading(true)
        socketStore.init(`/exams/${exam.id}`)
          .on('authenticated', () => {
            if (typeof hideSocketLoading === 'function') hideSocketLoading()
            setSocketLoading(false)
          })
          .on('unauthorized', error => {
            throw error
          })
          .on('examStatus', payload => exam.updateStatus(payload))
          .on('examAllowLogin', payload => examAdmin.updateAllowLogin(payload))
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
            const { id, url, timestamp } = payload
            const snapshot = { url: url, timestamp: timestamp }
            examAdmin.updateTester(id, {
              lastSnapshot: snapshot
            })
            examAdmin.addSnapshotToTester(id, snapshot)
          })
          .on('newEvent', payload => {
            const { id, event } = payload
            examAdmin.addEventToTester(id, event)
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
  }, [examAdmin.socketToken])

  if (exam.loading) return <Loading />
  else if (exam.error) return <Error />
  else if (!exam.info.name) return <NotFound />
  return (
    <Switch>
      <Route exact path={match.url + '/settings'} component={ExamSettingsPage} />
      <Route exact path={match.url + '/overview'} component={ExamOverviewPage} />
      <Route exact path={match.url + '/testers/:testerId'} component={ExamTesterPage} />
    </Switch>
  )
}

export default observer(AdminExamPage)
