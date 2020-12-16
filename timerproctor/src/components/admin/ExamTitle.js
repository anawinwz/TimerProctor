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
      >
        { name }
      </Title>
      <Text type="secondary">{ url }</Text>
    </>
  )
}

export default ExamTitle
