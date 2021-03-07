import { Switch, Route } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import Loading from '~/components/exams/Loading'
import ExamPage from './exams/[id]'

const MainPage = () => {
  const { AppStore: { hydrated } } = useStore()
  if (!hydrated) return <Loading />
  return (
    <Switch>
      <Route path="/exams/:id" component={ExamPage} />
    </Switch>
  )
}

export default observer(MainPage)
