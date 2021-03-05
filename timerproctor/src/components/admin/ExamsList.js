import { useCallback } from 'react'
import { List, Typography } from 'antd'
import { CalendarOutlined, LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import { observer } from 'mobx-react-lite'

import StatusTag from './StatusTag'

import { rangeStr, shortDateStr } from '~/utils/date'

const ExamsList = ({ pageSize = 5, loading = false, dataSource = [], header = null }) => {
  const renderExam = useCallback(exam => {
    const { _id, name, status, timeWindow, updatedAt, createdAt } = exam

    let str_timeWindow = ''
    if (status === 'unset' || !timeWindow) str_timeWindow = '-'
    else if (timeWindow.mode === 'realtime') str_timeWindow = 'ตามเวลาจริง'
    else str_timeWindow = rangeStr(timeWindow.schedule?.startDate, timeWindow.schedule?.endDate)
  
    return (
      <List.Item>
        <List.Item.Meta
          title={
            <Link to={`/admin/exams/${_id}/${status === 'unset' ? 'settings' : 'overview'}`}>
              <Typography.Title level={5}>{ name }</Typography.Title>
            </Link>
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
  }, [])

  return (
    <List
      bordered
      header={header}
      loading={{ spinning: loading, indicator: <LoadingOutlined /> }}
      size="small"
      rowKey="_id"
      dataSource={dataSource}
      pagination={{ 
        position: 'bottom',
        pageSize: pageSize,
      }}
      renderItem={renderExam}
    />
  )
}

export default observer(ExamsList)
