import 'antd/dist/antd.css'
import './styles/globals.css'

import { BrowserRouter, Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { ConfigProvider } from 'antd'
import thTH from 'antd/lib/locale/th_TH'

import RootStore, { StoreContext } from './stores/index'
import AdminRootStore, { AdminStoreContext } from './stores/admin'

import AdminPage from './pages/admin'
import MainPage from './pages/index'

function App() {
  const isServer = typeof window === 'undefined'
  const SelectedRouter = isServer ? Router : BrowserRouter
  const history = isServer ? createMemoryHistory() : createBrowserHistory()
  return (
    <StoreContext.Provider value={new RootStore()}>
      <AdminStoreContext.Provider value={new AdminRootStore()}>
        <ConfigProvider locale={thTH}>
          <SelectedRouter history={history}>
            <Switch>
              <Route path="/admin" component={AdminPage} />
              <Route component={MainPage} />
            </Switch>
          </SelectedRouter>
        </ConfigProvider>
      </AdminStoreContext.Provider>
    </StoreContext.Provider>
  )
}

export default App
    