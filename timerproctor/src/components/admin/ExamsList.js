import { useCallback } from 'react'
import { List } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import ExamListItem from './ExamListItem'

const ExamsList = ({ pageSize = 5, loading = false, dataSource = [], header = null }) => {
  const renderExam = useCallback(exam => <ExamListItem exam={exam} />, [])

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
