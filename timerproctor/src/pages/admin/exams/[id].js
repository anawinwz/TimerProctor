import { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStore } from '../../../stores/admin.js'

import ExamSettingsPage from './[id]/settings.js'
import ExamOverviewPage from './[id]/overview.js'

const AdminExamPage = ({ match }) => {
  const { ExamStore: exam } = useStore()

  useEffect(() => {
    exam.getInfo({ id: match.params?.id })
  }, [match.params?.id])

  return (
    <Switch>
      <Route exact path={match.url + '/settings'} component={ExamSettingsPage} />
      <Route exact path={match.url + '/overview'} component={ExamOverviewPage} />
    </Switch>
  )
}

export default observer(AdminExamPage)
