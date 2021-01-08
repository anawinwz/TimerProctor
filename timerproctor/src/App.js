import 'antd/dist/antd.css'
import './styles/globals.css'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import AdminPage from './pages/admin'
import MainPage from './pages/index'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin" component={AdminPage} />
        <Route component={MainPage} />
      </Switch>
    </Router>
  )
}

export default App
    