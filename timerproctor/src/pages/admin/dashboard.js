import ExamsList from '~/components/admin/ExamsList'
import ProctoringsList from '~/components/admin/ProctoringsList'
import useSuffixTitle from '~/hooks/useSuffixTitle'

const AdminDashboard = () => {
  useSuffixTitle('หน้าหลักระบบจัดการการสอบ')
  return (
    <>
      <ExamsList />
      <ProctoringsList />
    </>
  )
}

export default AdminDashboard
