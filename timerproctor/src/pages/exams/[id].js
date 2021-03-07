import { useEffect, useState } from 'react'
import { Switch } from 'react-router-dom'
import { useTitle } from 'react-use'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import Loading from '~/components/exams/Loading'
import Error from '~/components/exams/Error'
import NotFound from '~/components/exams/NotFound'

import LayoutRoute from '~/components/LayoutRoute'
import DefaultLayout from '~/layouts/default'
import ExamLayout from '~/layouts/exams'

import { showModal } from '~/utils/modal'

import IntroPage from './[id]/index'
import AuthenPage from './[id]/authenticate'
import WaitingPage from './[id]/waiting'
import AttemptPage from './[id]/attempt'
import CompletedPage from './[id]/completed'
import FailedPage from './[id]/failed'

const ExamPage = ({ match }) => {
  const { ExamStore: exam, SocketStore: socketStore, IDCheckStore: idCheck, AttemptStore: attempt } = useStore()
  const [socketLoading, setSocketLoading] = useState(false)

  useEffect(async () => {
    exam.clearInfo()
    await exam.getInfo({ id: match.params.id })
  }, [match.params.id])

  useTitle(exam?.name || 'TimerProctor')

  useEffect(() => {
    if (attempt.socketToken) {
      try {
        setSocketLoading(true)
        socketStore.init(`/exams/${exam.id}`)
          .on('authenticated', () => setSocketLoading(false))
          .on('unauthorized', error => {
            throw error
          })
          .on('examStatus', payload => exam.updateStatus(payload))
          .on('idCheckResponse', ({ accepted, reason }) => {
            idCheck.setResult(accepted, reason)
            if (accepted === false) {
              idCheck.setSendState(['IDLE', ''])
              idCheck.setResult(null, '')
            }
          })
          .on('examAnnouncement', text => exam.updateAnnouncement(text))
          .on('connect', () => socketStore.socket.emit('authenticate', { token: attempt.socketToken }))
          .connect()
      } catch {
        showModal('error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์คุมสอบได้', 'กรุณาเข้าสู่การสอบใหม่อีกครั้ง')
        socketStore.destroy()
      }
    }
    return () => {
      socketStore.destroy()
    }
  }, [attempt.socketToken])

  if (exam.loading || socketLoading) return <Loading />
  else if (exam.error) return <Error />
  else if (!exam.info.name) return <NotFound />
  return (
    <Switch>
      <LayoutRoute exact path={match.url} component={IntroPage} layout={DefaultLayout} />
      <LayoutRoute exact path={match.url + '/authenticate'} component={AuthenPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/waiting'} component={WaitingPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/attempt'} component={AttemptPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/completed'} component={CompletedPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/failed'} component={FailedPage} layout={ExamLayout} />
    </Switch>
  )
}

export default observer(ExamPage)
    