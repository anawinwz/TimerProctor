import { Switch } from 'react-router-dom'

import LayoutRoute from '~/components/LayoutRoute'
import DefaultLayout from '~/layouts/default'
import AdminLayout from '~/layouts/admin'

import LoginPage from './login'
import DashboardPage from './dashboard'
import ExamsPage from './exams/index'
import ExamPage from './exams/[id]'

const AdminPage = () => {
  return (
    <Switch>
      <LayoutRoute exact path="/admin/login" component={LoginPage} layout={DefaultLayout} />
      <LayoutRoute exact path="/admin/dashboard" component={DashboardPage} layout={AdminLayout} />
      <LayoutRoute exact path="/admin/exams" component={ExamsPage} layout={AdminLayout} />
      <LayoutRoute path="/admin/exams/:id" component={ExamPage} layout={AdminLayout} />
    </Switch>
  )
}

export default AdminPage
