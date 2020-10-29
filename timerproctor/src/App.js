import 'antd/dist/antd.css'
import './styles/globals.css'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ExamPage from './pages/exams/[id].js'
import store, { StoreContext } from './stores'
import ProctorDemoPage from './pages/proctorDemo'

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Router>
        <Switch>
          <Route path="/exams/:id" component={ExamPage} />
          <Route exact path="/proctordemo" component={ProctorDemoPage} />
        </Switch>
      </Router>
    </StoreContext.Provider>
  )
}

export default App
    