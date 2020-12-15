import { Switch } from 'react-router-dom'

import LayoutRoute from '../../components/LayoutRoute.js'
import DefaultLayout from '../../layouts/default.js'
import AdminLayout from '../../layouts/admin.js'

import DashboardPage from './dashboard.js'

const AdminPage = () => {
  return (
    <Switch>
      <LayoutRoute exact path="/admin/login" component={DashboardPage} layout={DefaultLayout} />
      <LayoutRoute exact path="/admin/dashboard" component={DashboardPage} layout={AdminLayout} />
    </Switch>
  )
}

export default AdminPage
