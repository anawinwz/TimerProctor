import { Result } from 'antd'
import DefaultLayout from '~/layouts/default'

const Error = () => (
  <DefaultLayout>
    <Result
      status="500"
      title="เกิดข้อผิดพลาด"
      subTitle="กรุณาติดต่ออาจารย์ผู้สอนหรือทีมงาน"
    />
  </DefaultLayout>
)

export default Error
