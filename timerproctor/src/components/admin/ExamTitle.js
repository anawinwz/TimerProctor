import { Typography } from 'antd'

const { Title, Text } = Typography

const ExamTitle = ({ exam, editable, onEdit }) => {
  const { name, linked: { url } } = exam
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
      <p><Text type="secondary">{ url }</Text></p>
    </>
  )
}

export default ExamTitle
