import 'antd/dist/antd.css'
import './styles/globals.css'

import { Switch, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import thTH from 'antd/lib/locale/th_TH'

import RootStore, { StoreContext } from './stores/index'
import AdminRootStore, { AdminStoreContext } from './stores/admin'

import AdminPage from './pages/admin'
import MainPage from './pages/index'

function App() {
  return (
    <StoreContext.Provider value={new RootStore()}>
      <AdminStoreContext.Provider value={new AdminRootStore()}>
        <ConfigProvider locale={thTH}>
        <Switch>
          <Route path="/admin" component={AdminPage} />
          <Route component={MainPage} />
        </Switch>
        </ConfigProvider>
      </AdminStoreContext.Provider>
    </StoreContext.Provider>
  )
}

export default App
    