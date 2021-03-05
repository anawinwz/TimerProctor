import ExamsListBox from '~/components/admin/ExamsListBox'
import ProctoringsListBox from '~/components/admin/ProctoringsListBox'
import useAppTitle from '~/hooks/useAppTitle'

const AdminExams = () => {
  useAppTitle('การสอบและการคุมสอบ', { admin: true })
  return (
    <>
      <ExamsListBox pageSize={10} />
      <ProctoringsListBox pageSize={10} />
    </>
  )
}

export default AdminExams
