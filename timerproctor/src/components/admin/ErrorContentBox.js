import { Result } from 'antd'
import ContentBox from '~/components/admin/ContentBox'

const ErrorContentBox = () => (
  <ContentBox>
    <Result
      status="error"
      title="เกิดข้อผิดพลาดในการโหลดข้อมูล"
    />
  </ContentBox>
)

export default ErrorContentBox
