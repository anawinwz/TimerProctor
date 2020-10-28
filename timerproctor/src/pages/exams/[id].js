
import { useEffect } from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStore } from '../../stores/index.js'

import DefaultLayout from '../../layouts/default.js'
import ExamLayout from '../../layouts/exams.js'

import CompletedPage from './[id]/completed.js'
import IntroPage from './[id]/index.js'
import AuthenPage from './[id]/authenticate.js'
import WaitingPage from './[id]/waiting.js'

const ExamPage = ({ match }) => {
  const { ExamStore } = useStore()

  const location = useLocation()
  const Layout = location.pathname.endsWith(match.params?.id) ? DefaultLayout : ExamLayout

  useEffect(() => {
    ExamStore?.getInfo({ id: match.params?.id })
  }, [match.params?.id])

  return (
    <Layout>
      <Switch>
        <Route exact path={match.url} component={IntroPage} />
        <Route exact path={match.url + '/authenticate'} component={AuthenPage} />
        <Route exact path={match.url + '/waiting'} component={WaitingPage} />
        <Route exact path={match.url + '/completed'} component={CompletedPage} />
      </Switch>
    </Layout>
  )
}

export default observer(ExamPage)
    