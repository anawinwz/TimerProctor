import ExamsListBox from '~/components/admin/ExamsListBox'
import ProctoringsListBox from '~/components/admin/ProctoringsListBox'
import useAppTitle from '~/hooks/useAppTitle'

const AdminDashboard = () => {
  useAppTitle('หน้าหลัก', { admin: true })
  return (
    <>
      <ExamsListBox />
      <ProctoringsListBox />
    </>
  )
}

export default AdminDashboard
