import ExamsList from '~/components/admin/ExamsList'
import useSuffixTitle from '~/hooks/useSuffixTitle'

const AdminExams = () => {
  useSuffixTitle('การสอบของฉัน')
  return (
    <>
      <ExamsList pageSize={10} />
    </>
  )
}

export default AdminExams
