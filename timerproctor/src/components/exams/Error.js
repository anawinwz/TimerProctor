import { Result } from 'antd'
import Status from 'components/Status'
import DefaultLayout from '~/layouts/default'

const Error = () => (
  <Status code={500}>
    <DefaultLayout>
      <Result
        status="500"
        title="เกิดข้อผิดพลาด"
        subTitle="กรุณาติดต่ออาจารย์ผู้สอนหรือทีมงาน"
      />
    </DefaultLayout>
  </Status>
)

export default Error
