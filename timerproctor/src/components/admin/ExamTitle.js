import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Typography, Tooltip } from 'antd'
import { GoogleOutlined, ExportOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const ExamLink = styled(Paragraph)`
  margin-bottom: 0 !important;
`

const Subtitle = styled(Text)`
  display: block;
  margin-bottom: 1em;
`

const ExamTitle = ({ exam, editable = false, onEdit = () => {} }) => {
  const { _id, name, linked } = exam
  const publicURL = linked?.publicURL
  const editConfig = !editable ? false : {
    tooltip: 'แก้ไขชื่อการสอบ',
    autoSize: { maxRows: 1 },
    maxLength: 255,
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
      <ExamLink copyable>{ `${window?.location?.protocol}//${window?.location?.host}/exams/${_id}` }</ExamLink>
      <Subtitle type="secondary">
        <GoogleOutlined /> สร้างจาก Google Forms:{' '}
        <Tooltip title={publicURL}>
          <a href={publicURL} target="_blank"><ExportOutlined /> เปิดดูฟอร์มต้นฉบับ</a>
        </Tooltip>
      </Subtitle>
    </>
  )
}

export default observer(ExamTitle)
