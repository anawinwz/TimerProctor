import { Card } from 'antd'
import Loading from './Loading'
import GoogleForm from './GoogleForm'

const Form = ({ form, onCompleted }) => {
  if (!form) return <Card><Loading /></Card>
  return (
    <Card style={{ marginTop: '100px' }}>
      <GoogleForm form={form} onCompleted={onCompleted} />
    </Card>
  )
}

export default Form
