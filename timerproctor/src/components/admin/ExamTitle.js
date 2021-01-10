import { observer } from 'mobx-react-lite'
import { Typography } from 'antd'

const { Title, Text } = Typography

const ExamTitle = ({ exam, editable, onEdit }) => {
  const { name, linked } = exam
  const publicURL = linked?.publicURL
  const editConfig = !editable ? false : {
    tooltip: 'แก้ไขชื่อการสอบ',
    autoSize: { maxRows: 1 },
    onChange: onEdit
  } 

  return (
    <>
      <Title 
        level={3}
        editable={editConfig}
        style={{ marginBottom: 0 }}
      >
        { name }
      </Title>
      <p><Text type="secondary">{ publicURL }</Text></p>
    </>
  )
}

export default observer(ExamTitle)
