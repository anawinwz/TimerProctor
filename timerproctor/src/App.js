import 'antd/dist/antd.less'
import './styles/App.less'

import { Switch, Route } from 'react-router-dom'
import { ConfigProvider, notification, Spin } from 'antd'
import thTH from 'antd/lib/locale/th_TH'
import { LoadingOutlined } from '@ant-design/icons'

import RootStore, { StoreContext } from './stores/index'
import AdminRootStore, { AdminStoreContext } from './stores/admin'

import AdminPage from './pages/admin'
import MainPage from './pages/index'

Spin.setDefaultIndicator(<LoadingOutlined />)
notification.config({
  placement: 'bottomRight',
  duration: 8
})

const preloadStore = typeof window !== 'undefined' ? window.__PRELOAD_STATE__ : null
const preloadAdminStore = typeof window !== 'undefined' ? window.__PRELOAD_ADMSTATE__ : null

function App({ store = new RootStore(preloadStore), adminStore = new AdminRootStore(preloadAdminStore) }) {
  return (
    <StoreContext.Provider value={store}>
      <AdminStoreContext.Provider value={adminStore}>
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
    