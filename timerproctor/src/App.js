import 'antd/dist/antd.css'
import './styles/globals.css'

import RootStore, { StoreContext } from './stores'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import AdminPage from './pages/admin'
import ExamPage from './pages/exams/[id].js'

import DemoPage from './pages/demo'
import ProctorDemoPage from './pages/proctorDemo'

function App() {
  return (
    <StoreContext.Provider value={new RootStore()}>
      <Router>
        <Switch>
          <Route path="/admin" component={AdminPage} />
          <Route path="/exams/:id" component={ExamPage} />
          <Route exact path="/" component={DemoPage} />
          <Route exact path="/proctordemo" component={ProctorDemoPage} />
        </Switch>
      </Router>
    </StoreContext.Provider>
  )
}

export default App
    