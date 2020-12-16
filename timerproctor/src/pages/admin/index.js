import { Switch } from 'react-router-dom'

import LayoutRoute from '../../components/LayoutRoute.js'
import DefaultLayout from '../../layouts/default.js'
import AdminLayout from '../../layouts/admin.js'

import DashboardPage from './dashboard.js'
import ExamsPage from './exams/index.js'
import ExamPage from './exams/[id].js'

const AdminPage = () => {
  return (
    <Switch>
      <LayoutRoute exact path="/admin/login" component={DashboardPage} layout={DefaultLayout} />
      <LayoutRoute exact path="/admin/dashboard" component={DashboardPage} layout={AdminLayout} />
      <LayoutRoute exact path="/admin/exams" component={ExamsPage} layout={AdminLayout} />
      <LayoutRoute path="/admin/exams/:id" component={ExamPage} layout={AdminLayout} />
    </Switch>
  )
}

export default AdminPage
