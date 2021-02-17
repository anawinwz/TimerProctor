import ExamsList from '~/components/admin/ExamsList'
import useAppTitle from '~/hooks/useAppTitle'

const AdminExams = () => {
  useAppTitle('การสอบของฉัน', { admin: true })
  return (
    <>
      <ExamsList pageSize={10} />
    </>
  )
}

export default AdminExams
