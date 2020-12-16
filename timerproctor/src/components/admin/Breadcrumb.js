import { Breadcrumb } from 'antd'
import { withRouter, Link } from 'react-router-dom'

const breadcrumbNameMap = {
  '/tests': 'การสอบของฉัน',
  '/proctorings': 'การคุมสอบของฉัน',
}

const AdminBreadcrumb = withRouter(props => {
  const { location } = props

  const pathSnippets = location.pathname.replace('/admin','').split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets
    .map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`)
    .filter(url => url !== '/dashboard')
    .map(url => {
      return (
        <Breadcrumb.Item key={url}>
          <Link to={`/admin${url}`}>{ breadcrumbNameMap[url] }</Link>
        </Breadcrumb.Item>
      )
    })

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/admin/dashboard">หน้าหลัก</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems)

  return <Breadcrumb separator=">">{ breadcrumbItems }</Breadcrumb>
})

export default AdminBreadcrumb
