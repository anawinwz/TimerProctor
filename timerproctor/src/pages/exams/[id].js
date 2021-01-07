
import { useEffect, useState } from 'react'
import { Switch } from 'react-router-dom'
import { io } from 'socket.io-client'
import { observer } from 'mobx-react'
import { useStore } from '../../stores/index.js'

import Loading from '../../components/exams/Loading.js'
import Error from '../../components/exams/Error.js'
import NotFound from '../../components/exams/NotFound.js'

import LayoutRoute from '../../components/LayoutRoute.js'
import DefaultLayout from '../../layouts/default.js'
import ExamLayout, { ExamNormalLayout } from '../../layouts/exams.js'

import IntroPage from './[id]/index.js'
import AuthenPage from './[id]/authenticate.js'
import WaitingPage from './[id]/waiting.js'
import AttemptPage from './[id]/attempt.js'
import CompletedPage from './[id]/completed.js'
import FailedPage from './[id]/failed.js'

const ExamPage = ({ match }) => {
  const [socket, setSocket] = useState(null)
  const { ExamStore: exam, AuthStore: auth, IDCheckStore: idCheck, AttemptStore: attempt } = useStore()

  useEffect(() => {
    exam.getInfo({ id: match.params?.id })
  }, [match.params?.id])

  useEffect(() => {
    if (!socket && attempt.socketToken) {
      try {
        const tempSocket = io(`http://localhost:5000/exams/${exam.id}`)
        tempSocket
          .on('authenticated', () => {
            setSocket(tempSocket)
          })
          .on('unauthorized', () => {
            console.log(`Unauthorized!`)
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
          .on('connect', () => {
            tempSocket.emit('authenticate', { token: attempt.socketToken })
          })
      } catch {
        setSocket(null)
      }
    }
    return () => {
      if (socket) socket.close()
      setSocket(null)
    }
  }, [socket, attempt.socketToken])

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
    