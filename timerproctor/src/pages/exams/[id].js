
import { useEffect, useState } from 'react'
import { Switch } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStore } from '../../stores/index.js'

import Loading from '../../components/exams/Loading.js'
import Error from '../../components/exams/Error.js'
import NotFound from '../../components/exams/NotFound.js'

import LayoutRoute from '../../components/LayoutRoute.js'
import DefaultLayout from '../../layouts/default.js'
import ExamLayout from '../../layouts/exams.js'

import CompletedPage from './[id]/completed.js'
import IntroPage from './[id]/index.js'
import AuthenPage from './[id]/authenticate.js'
import WaitingPage from './[id]/waiting.js'

const ExamPage = ({ match }) => {
  const [ws, setWS] = useState(null)
  const { ExamStore: exam, AuthStore: auth } = useStore()

  useEffect(() => {
    exam.getInfo({ id: match.params?.id })
  }, [match.params?.id])

  useEffect(() => {
    if (auth.isLoggedIn) {
      try {
        const tempWs = new WebSocket('ws://localhost:5000/testtaker')
        tempWs.onmessage = (evt) => {
          const data = JSON.parse(evt?.data) || {}
          const { type, payload }  = data
          console.log(type, payload)

          if (!type) return false
          switch (type) {
            case 'examStatus': exam.updateStatus(payload); break
            case 'idCheckResponse':
              const { accepted, reason } = payload
              auth.setIDCheck(accepted, reason)
              break
          }
        }
        setWS(tempWs)
      } catch {
        setWS(null)
      }
    }
    return () => {
      if (ws) ws.close()
      setWS(null)
    }
  }, [auth.isLoggedIn])

  if (exam.loading) return <Loading />
  if (exam.error) return <Error />
  if (!exam.name) return <NotFound />
  return (
    <Switch>
      <LayoutRoute exact path={match.url} component={IntroPage} layout={DefaultLayout} />
      <LayoutRoute exact path={match.url + '/authenticate'} component={AuthenPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/waiting'} component={WaitingPage} layout={ExamLayout} />
      <LayoutRoute exact path={match.url + '/completed'} component={CompletedPage} layout={ExamLayout} />
    </Switch>
  )
}

export default observer(ExamPage)
    