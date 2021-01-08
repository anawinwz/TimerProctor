
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import ExamPage from './exams/[id].js'

const MainPage = () => (
  <Router>
    <Switch>
      <Route path="/exams/:id" component={ExamPage} />
    </Switch>
  </Router>
)

export default MainPage
