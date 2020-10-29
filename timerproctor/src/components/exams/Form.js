import { Card } from 'antd'
import Loading from './Loading'

const Form = ({formId, ref, onLoad}) => {
  return (
    <Card>
      <iframe
        src={`https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        width="100%"
        style={{ height: '80vh' }}
        onLoad={onLoad}
      >
        <Loading />
      </iframe>
    </Card>
  )
}

export default Form
