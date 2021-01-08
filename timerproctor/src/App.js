import 'antd/dist/antd.css'
import './styles/globals.css'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import RootStore, { StoreContext } from './stores/index'
import AdminRootStore, { AdminStoreContext } from './stores/admin'

import AdminPage from './pages/admin'
import MainPage from './pages/index'

function App() {
  return (
    <StoreContext.Provider value={new RootStore()}>
      <AdminStoreContext.Provider value={new AdminRootStore()}>
        <Router>
          <Switch>
            <Route path="/admin" component={AdminPage} />
            <Route component={MainPage} />
          </Switch>
        </Router>
      </AdminStoreContext.Provider>
    </StoreContext.Provider>
  )
}

export default App
    