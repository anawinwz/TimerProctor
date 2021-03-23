import { Card } from 'antd'
import { observer } from 'mobx-react-lite'

import Loading from './Loading'
import GoogleForm from './GoogleForm'

const Form = ({ form, onCompleted }) => {
  if (!form) return <Card><Loading /></Card>
  return (
    <Card style={{ marginTop: '100px', background: '#ececec', marginBottom: '30px' }}>
      <GoogleForm form={form} onCompleted={onCompleted} />
    </Card>
  )
}

export default observer(Form)
