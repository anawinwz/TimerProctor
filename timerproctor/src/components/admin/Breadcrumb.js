import { Breadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { truncateStr } from 'utils/const'

const breadcrumbNameMap = {
  '/exams': 'การสอบและการคุมสอบ',
  '/exams/:id': ':examName',
  '/exams/:id/settings': 'ตั้งค่า',
  '/exams/:id/overview': 'ภาพรวม',
  '/exams/:id/testers/:id' : 'รายงานผู้เข้าสอบ',
}

const AdminBreadcrumb = props => {
  const location = useLocation()
  const { ExamStore: { info: exam } } = useStore()

  const pathSnippets = location.pathname.replace('/admin','').split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets
    .map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`)
    .filter(url => url !== '/dashboard' && !url.match(/^\/exams\/[a-f\d]{24}\/testers$/))
    .map(url => {
      const mapUrl = url.replace(/\/[a-f\d]{24}/g, '/:id')
      const breadcrumbName = breadcrumbNameMap[mapUrl]
      return { url: url, name: breadcrumbName }
    })

  const breadcrumbItems = [
    { url: '/dashboard', name: 'หน้าหลัก' }
  ].concat(extraBreadcrumbItems)

  return (
    <Breadcrumb separator=">" style={{ margin: '16px 0' }}>
      { breadcrumbItems.map(({ url, name }) => {
        return (
          <Breadcrumb.Item key={url}>
            <Link to={`/admin${url}`}>{ name === ':examName' ? truncateStr(exam.name, 16) : name }</Link>
          </Breadcrumb.Item>
        )
      }) }
    </Breadcrumb>
  )
}

export default observer(AdminBreadcrumb)
