import { Card } from 'antd'
import Loading from './Loading'
import GoogleForm from './GoogleForm'

const Form = ({ form }) => {
  if (!form) return <Card><Loading /></Card>
  return (
    <Card>
      <GoogleForm form={form} />
    </Card>
  )
}

export default Form
