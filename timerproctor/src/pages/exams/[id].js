import { useEffect, useState } from 'react'
import { Switch } from 'react-router-dom'
import { io } from 'socket.io-client'
import { observer } from 'mobx-react'
import { useStore } from '~/stores/index'

import Loading from '~/components/exams/Loading'
import Error from '~/components/exams/Error'
import NotFound from '~/components/exams/NotFound'

import LayoutRoute from '~/components/LayoutRoute'
import DefaultLayout from '~/layouts/default'
import ExamLayout, { ExamNormalLayout } from '~/layouts/exams'

import IntroPage from './[id]/index'
import AuthenPage from './[id]/authenticate'
import WaitingPage from './[id]/waiting'
import AttemptPage from './[id]/attempt'
import CompletedPage from './[id]/completed'
import FailedPage from './[id]/failed'

const ExamPage = ({ match }) => {
  const [socket, setSocket] = useState(null)
  const { ExamStore: exam, AuthStore: auth, IDCheckStore: idCheck, AttemptStore: attempt } = useStore()

  useEffect(() => {
    exam.getInfo({ id: match.params?.id })
  }, [match.params?.id])

  useEffect(() => {
    if (attempt.socketToken) {
      try {
        const tempSocket = io(`http://localhost:5000/exams/${exam.id}`)
        tempSocket
          .on('authenticated', () => {
            console.log('Authenticated')
            setSocket(tempSocket)
          })
          .on('unauthorized', error => {
            console.log(`Unauthorized:`, error)
          })
          .on('examStatus', payload => exam.updateStatus(payload))
          .on('idCheckResponse', ({ accepted, reason }) => {
            idCheck.setResult(accepted, reason)
            if (accepted === false) {
              idCheck.setSendState(['IDLE', ''])
              idCheck.setResult(null, '')
            }
          })
          .on('examAnnoucement', text => exam.updateAnnoucement(text))
          .on('connect', () => tempSocket.emit('authenticate', { token: attempt.socketToken }))
      } catch {
        setSocket(null)
      }
    }
    return () => {
      if (socket) socket.close()
      setSocket(null)
    }
  }, [attempt.socketToken])

  if (exam.loading) return <Loading />
  if (exam.error) return <Error />
  if (!exam.info.name) return <NotFound />
  return (
    <Switch>
      <LayoutRoute exact path={match.url} component={IntroPage} layout={DefaultLayout} />
      <LayoutRoute exact path={match.url + '/authenticate'} component={AuthenPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/waiting'} component={WaitingPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/attempt'} component={AttemptPage} layout={ExamNormalLayout} />
      <LayoutRoute exact path={match.url + '/completed'} component={CompletedPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/failed'} component={FailedPage} layout={ExamLayout} />
    </Switch>
  )
}

export default observer(ExamPage)
    