import { LoadingOutlined } from '@ant-design/icons'
import DefaultLayout from '~/layouts/default'

const Loading = () => (
  <DefaultLayout>
    <LoadingOutlined spin style={{ fontSize: '72px', margin: '0 auto', display: 'block' }} />
  </DefaultLayout>
)

export default Loading
