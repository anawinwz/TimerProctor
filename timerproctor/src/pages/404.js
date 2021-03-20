import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

import Status from '~/components/Status'

const Error404Page = () => {
  return (
    <Status code={404}>
      <Result
        title="ไม่พบหน้าที่คุณต้องการ"
        extra={
          <Link to={'/'}>
            <Button type="primary">กลับหน้าแรก</Button>
          </Link>
        }
      />
    </Status>
  )
}

export default Error404Page
