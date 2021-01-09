import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import DefaultLayout from '~/layouts/default'

const LargeButton = styled(Button)`
  transform: scale(2.0);
  display: block;
  margin: 0 auto;
  margin-bottom: 100px;
`

const DemoPage = () => (
  <DefaultLayout>
    <Link to="/exams/5f991c780953aa4110686e76">
      <LargeButton type="primary" size="large" ghost>Exam Demo</LargeButton>
    </Link>
    <Link to="/proctordemo">
      <LargeButton type="primary" size="large" ghost>Proctor Demo</LargeButton>
    </Link>
  </DefaultLayout>
)

export default DemoPage
