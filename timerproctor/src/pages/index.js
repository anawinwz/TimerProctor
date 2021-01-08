import RootStore, { StoreContext } from '../stores/index'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import ExamPage from './exams/[id].js'

const MainPage = () => (
  <StoreContext.Provider value={new RootStore()}>
    <Router>
      <Switch>
        <Route path="/exams/:id" component={ExamPage} />
      </Switch>
    </Router>
  </StoreContext.Provider>
)

export default MainPage
