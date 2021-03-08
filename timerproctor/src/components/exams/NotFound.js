import { Result } from 'antd'
import Status from 'components/Status'
import DefaultLayout from '~/layouts/default'

const NotFound = () => (
  <Status code={404}>
    <DefaultLayout>
      <Result
        status="404"
        title="ไม่พบการสอบที่คุณต้องการ"
        subTitle="กรุณาตรวจสอบลิงก์ที่ได้รับอีกครั้ง"
      />
    </DefaultLayout>
  </Status>
)

export default NotFound
