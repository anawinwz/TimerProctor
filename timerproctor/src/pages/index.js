import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import Loading from '~/components/exams/Loading'
import ExamPage from './exams/[id]'

const MainPage = () => {
  const { AppStore: { hydrated } } = useStore()
  if (!hydrated) return <Loading />
  return (
    <Router>
      <Switch>
        <Route path="/exams/:id" component={ExamPage} />
      </Switch>
    </Router>
  )
}

export default observer(MainPage)
