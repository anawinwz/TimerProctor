import { Breadcrumb } from 'antd'
import { withRouter, Link } from 'react-router-dom'

const breadcrumbNameMap = {
  '/exams': 'การสอบและการคุมสอบ',
  '/exams/:id/settings': 'ตั้งค่าการสอบ',
  '/exams/:id/overview': 'ภาพรวมการสอบ',
  '/exams/:id/testers/:id' : 'รายงานผู้เข้าสอบ',
}

const AdminBreadcrumb = withRouter(props => {
  const { location } = props

  const pathSnippets = location.pathname.replace('/admin','').split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets
    .map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`)
    .filter(url => url !== '/dashboard' && !url.match(/^\/exams\/[a-f\d]{24}\/?$/) && !url.match(/^\/exams\/[a-f\d]{24}\/testers$/))
    .map(url => {
      const mapUrl = url.replace(/\/[a-f\d]{24}/g, '/:id')
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
