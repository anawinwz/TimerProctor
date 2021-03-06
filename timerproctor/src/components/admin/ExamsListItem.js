import { List, Typography } from 'antd'
import { CalendarOutlined, } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import StatusTag from './StatusTag'

import { rangeStr, shortDateStr } from '~/utils/date'

const ExamsListItem = ({ exam, onProctoringRespond = () => {} }) => {
  const { _id, name, status, timeWindow, updatedAt, createdAt, proctoring } = exam

  let str_timeWindow = ''
  if (status === 'unset' || !timeWindow) str_timeWindow = '-'
  else if (timeWindow.mode === 'realtime') str_timeWindow = 'ตามเวลาจริง'
  else str_timeWindow = rangeStr(timeWindow.schedule?.startDate, timeWindow.schedule?.endDate)

  const canLink = !proctoring?.status || proctoring.status === 'accepted'
  return (
    <List.Item
      actions={proctoring?.status === 'invited' ? [
        <a onClick={() => onProctoringRespond(proctoring.id, 'accepted')}>ตอบรับ</a>,
        <a onClick={() => onProctoringRespond(proctoring.id, 'rejected')}>ปฏิเสธ</a>
      ] : []}
    >
      <List.Item.Meta
        title={
          canLink ? 
            <Link to={`/admin/exams/${_id}/${status === 'unset' ? 'settings' : 'overview'}`}>
              <Typography.Title level={5}>{ name }</Typography.Title>
            </Link> :
            <Typography.Title level={5}>{ name }</Typography.Title>
        }
        description={
          <>
            <StatusTag className="d-block" status={status} />
            <Typography.Text className="d-block">
              <CalendarOutlined /> { str_timeWindow }
            </Typography.Text>
            <Typography.Text className="d-block" type="secondary">
              { shortDateStr(updatedAt || createdAt) }
            </Typography.Text>
          </>
        }
      />
    </List.Item>
  )
}

export default ExamsListItem
