import { useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'
import { message, notification } from 'antd'

import { showModal } from '~/utils/modal'
import { isEventRisk } from '~/utils/const'

import Loading from '~/components/exams/Loading'
import Error from '~/components/exams/Error'
import NotFound from '~/components/exams/NotFound'

import ExamPage from './[id]/index'
import ExamSettingsPage from './[id]/settings'
import ExamOverviewPage from './[id]/overview'
import ExamTesterPage from './[id]/testers/[testerId]'
import Error404Page from '~/pages/404'

const AdminExamPage = ({ match }) => {
  const { ExamStore: exam, ExamAdminStore: examAdmin, SocketStore: socketStore, TimerStore: timer } = useStore()
  const history = useHistory()
  const { location } = history

  useEffect(async () => {
    exam.clearInfo()
    try {
      await exam.getInfo({ id: match.params.id })
      examAdmin.clearInfo()
      await examAdmin.startProctor()
      await examAdmin.startTimer()
    } catch {}
    return () => {
      timer.reset()
    }
  }, [match.params.id])

  useEffect(() => {
    let hideSocketLoading
    if (examAdmin.socketToken && examAdmin.lastExamId === exam.id) {
      hideSocketLoading = message.loading('กำลังเชื่อมต่อเซิร์ฟเวอร์คุมสอบ...')
      try {
        socketStore.init(`/exams/${exam.id}`)
          .on('connect', () => {
            if (typeof hideSocketLoading === 'function') hideSocketLoading()
          })
          .on('connect_error', error => {
            throw error
          })
          .on('examStatus', payload => {
            exam.updateLocalStatus(payload)
            examAdmin.startTimer()
          })
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

            if (examAdmin.currentStatus !== 'authenticating') {
              notification.info({
                key: `authen_${id}`,
                message: `${(examAdmin.testers?.[id]?.name || 'มีผู้เข้าสอบ').split(' ')[0]} ส่งคำขอยืนยันตัวตนใหม่`,
                description: 
                  location.pathname.includes('/overview') ?
                  <a onClick={() => {
                    examAdmin.setCurrentStatus('authenticating')
                    notification.close(`authen_${id}`)
                  }}>
                    ไปยังหน้า [รออนุมัติ]
                  </a> :
                  <>
                    ดูคำขอได้ที่แถบ [รออนุมัติ] ของหน้า
                    <a
                      href={`/admin/exams/${exam.id}/overview`}
                      onClick={e => {
                        e?.preventDefault()

                        examAdmin.setCurrentStatus('authenticating')
                        history.replace(`/admin/exams/${exam.id}/overview`)
                        notification.close(`authen_${id}`)
                      }}
                    >ภาพรวมการสอบ</a>
                  </>
              })
            }
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

            if (!location.pathname.includes(`/testers/${id}`) && isEventRisk(event)) {
              notification.warning({
                key: `risk_${id}`,
                message: `${(examAdmin.testers?.[id]?.name || 'มีผู้เข้าสอบ').split(' ')[0]} แสดงพฤติกรรมเสี่ยงใหม่!`,
                description: 
                  <a
                    href={`/admin/exams/${exam.id}/testers/${id}`}
                    onClick={e => {
                      e?.preventDefault()

                      history.replace(`/admin/exams/${exam.id}/testers/${id}`)
                      notification.close(`risk_${id}`)
                    }}
                  >ดูรายงาน</a>
              })
            }
          })
          .on('proctorUpdate', payload => {
            const { id, updates } = payload
            examAdmin.updateLocalProctor(id, updates)
          })

          socketStore
            .setToken(examAdmin.socketToken)
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
      <Route component={Error404Page} />
    </Switch>
  )
}

export default observer(AdminExamPage)
