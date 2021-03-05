import ExamsList from '~/components/admin/ExamsList'
import ProctoringsList from '~/components/admin/ProctoringsList'
import useAppTitle from '~/hooks/useAppTitle'

const AdminExams = () => {
  useAppTitle('การสอบและการคุมสอบ', { admin: true })
  return (
    <>
      <ExamsList pageSize={10} />
      <ProctoringsList pageSize={10} />
    </>
  )
}

export default AdminExams
