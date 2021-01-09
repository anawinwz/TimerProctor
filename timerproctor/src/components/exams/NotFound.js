import { Result } from 'antd'
import DefaultLayout from '~/layouts/default'

const NotFound = () => (
  <DefaultLayout>
    <Result
      status="404"
      title="ไม่พบการสอบที่คุณต้องการ"
      subTitle="กรุณาตรวจสอบลิงก์ที่ได้รับอีกครั้ง"
    />
  </DefaultLayout>
)

export default NotFound
