import { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { useTitle } from 'react-use'
import { Modal } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import Loading from '~/components/exams/Loading'
import Error from '~/components/exams/Error'
import NotFound from '~/components/exams/NotFound'

import LayoutRoute from '~/components/LayoutRoute'
import DefaultLayout from '~/layouts/default'
import ExamLayout from '~/layouts/exams'

import IntroPage from './[id]/index'
import AuthenPage from './[id]/authenticate'
import WaitingPage from './[id]/waiting'
import AttemptPage from './[id]/attempt'
import CompletedPage from './[id]/completed'
import FailedPage from './[id]/failed'
import Error404Page from '~/pages/404'

const ExamPage = ({ match }) => {
  const history = useHistory()
  const { ExamStore: exam, SocketStore: socketStore, IDCheckStore: idCheck, AttemptStore: attempt, TimerStore: timer } = useStore()
  const [socketLoading, setSocketLoading] = useState(false)
  const [flushSocket, setFlushSocket] = useState(0)

  useEffect(async () => {
    exam.clearInfo()
    idCheck.reset()
    attempt.reset()
    await exam.getInfo({ id: match.params.id })
  }, [match.params.id])

  useTitle(exam?.name || 'TimerProctor')

  useEffect(() => {
    if (attempt.socketToken) {
      try {
        setSocketLoading(true)
        socketStore.init(`/exams/${exam.id}`)
          .on('connect', () => setSocketLoading(false))
          .on('connect_error', error => {
            throw error
          })
          .on('examStatus', payload => exam.updateLocalStatus(payload))
          .on('idCheckResponse', ({ accepted = false, reason = '' }) => {
            attempt.setStatus(accepted ? 'authenticated' : 'loggedin')
            idCheck.setResult(accepted, reason)
            if (accepted === false) {
              idCheck.setSendState(['IDLE', ''])
              idCheck.setResult(null, '')
            }
          })
          .on('examAnnouncement', text => exam.addLocalAnnouncement(text))
          .on('terminated', () => {
            attempt.setStatus('terminated')
            
            timer.pause()
            Modal.error({
              title: 'คุณถูกเชิญออกจากการสอบ',
              content: 'กรรมการพิจารณาเชิญคุณออกจากการสอบแล้ว',
              okText: 'รับทราบ',
              cancelButtonProps: {
                style: { display: 'none' }
              },
              maskClosable: false,
              onOk: () => {
                idCheck.reset()
                attempt.reset()
              },
              onCancel: () => {
                idCheck.reset()
                attempt.reset()
              }
            })

            history.replace(`/exams/${exam.id}`)
          })
        
        socketStore
          .setToken(attempt.socketToken)
          .connect()
      } catch {
        Modal.error({
          title: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์คุมสอบได้',
          content: 'กรุณา [ลองเชื่อมต่ออีกครั้ง] หรือ [เข้าสู่การสอบใหม่]',
          maskClosable: false,
          okText: 'ลองเชื่อมต่ออีกครั้ง',
          cancelText: 'เข้าสู่การสอบใหม่',
          onOk: () => setFlushSocket(prev => prev + 1),
          onCancel: () => history.replace(`/exams/${exam.id}`)
        })
        
        socketStore.destroy()
      }
    }
    return () => {
      socketStore.destroy()
    }
  }, [attempt.socketToken, flushSocket])

  if (
    ![
      '',
      '/',
      '/authenticate',
      '/waiting',
      '/attempt',
      '/completed',
      '/failed'
    ].includes(history.location.pathname.replace(match.url, ''))
  ) 
    return <Error404Page />

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
      <Route component={Error404Page} />
    </Switch>
  )
}

export default observer(ExamPage)
    