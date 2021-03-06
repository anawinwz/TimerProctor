import { useCallback } from 'react'
import { List } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import ExamsListItem from './ExamsListItem'

const ExamsList = ({ pageSize = 5, loading = false, dataSource = [], header = null }) => {
  const renderExam = useCallback(exam => <ExamsListItem exam={exam} />, [])

  return (
    <List
      loading={{ spinning: loading, indicator: <LoadingOutlined /> }}
      size="small"
      itemLayout="horizontal"
      bordered
      header={header}
      dataSource={dataSource}
      rowKey="_id"
      pagination={{ 
        position: 'bottom',
        pageSize: pageSize,
      }}
      renderItem={renderExam}
    />
  )
}

export default observer(ExamsList)
