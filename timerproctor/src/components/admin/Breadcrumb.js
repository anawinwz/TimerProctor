import { Breadcrumb } from 'antd'
import { withRouter, Link } from 'react-router-dom'

const breadcrumbNameMap = {
  '/exams': 'การสอบของฉัน',
  '/exams/:id/settings': 'ตั้งค่าการสอบ',
  '/exams/:id/overview': 'ภาพรวมการสอบ',
  '/proctorings': 'การคุมสอบของฉัน',
}

const AdminBreadcrumb = withRouter(props => {
  const { location } = props

  const pathSnippets = location.pathname.replace('/admin','').split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets
    .map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`)
    .filter(url => url !== '/dashboard' && !url.match(/^\/exams\/[a-z0-9]+\/?$/))
    .map(url => {
      const mapUrl = url.replace(/^\/exams\/[a-z0-9]\//, '/exams/:id/')
      return (
        <Breadcrumb.Item key={url}>
          <Link to={`/admin${url}`}>{ breadcrumbNameMap[mapUrl] }</Link>
        </Breadcrumb.Item>
      )
    })

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/admin/dashboard">หน้าหลัก</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems)

  return (
    <Breadcrumb separator=">" style={{ margin: '16px 0' }}>
      { breadcrumbItems }
    </Breadcrumb>
  )
})

export default AdminBreadcrumb
