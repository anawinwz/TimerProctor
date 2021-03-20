import { Switch, Route } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import Loading from '~/components/exams/Loading'

import ExamPage from './exams/[id]'
import Error404Page from './404'

const MainPage = () => {
  const { AppStore: { hydrated } } = useStore()
  if (!hydrated) return <Loading />
  return (
    <Switch>
      <Route path="/exams/:id" component={ExamPage} />
      <Route component={Error404Page} />
    </Switch>
  )
}

export default observer(MainPage)
