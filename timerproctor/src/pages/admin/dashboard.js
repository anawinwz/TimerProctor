import ExamsList from '~/components/admin/ExamsList'
import ProctoringsList from '~/components/admin/ProctoringsList'
import useAppTitle from '~/hooks/useAppTitle'

const AdminDashboard = () => {
  useAppTitle('หน้าหลัก', { admin: true })
  return (
    <>
      <ExamsList />
      <ProctoringsList />
    </>
  )
}

export default AdminDashboard
