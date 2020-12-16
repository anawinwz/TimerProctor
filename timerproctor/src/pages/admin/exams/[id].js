import { Switch, Route } from 'react-router-dom'

import ExamSettingsPage from './[id]/settings.js'
import ExamOverviewPage from './[id]/overview.js'

const AdminExamPage = ({ match }) => {
  return (
    <Switch>
      <Route exact path={match.url + '/settings'} component={ExamSettingsPage} />
      <Route exact path={match.url + '/overview'} component={ExamOverviewPage} />
    </Switch>
  )
}

export default AdminExamPage
