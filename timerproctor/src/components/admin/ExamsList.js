import { useCallback } from 'react'
import { List } from 'antd'

import { observer } from 'mobx-react-lite'
import ExamsListItem from './ExamsListItem'

const ExamsList = ({
  pageSize = 5,
  loading = false,
  dataSource = [],
  header = null,
  onProctoringRespond = () => {},
}) => {
  const renderExam = useCallback(
    exam =>
    <ExamsListItem
      exam={exam}
      onProctoringRespond={onProctoringRespond}
    />,
    [onProctoringRespond]
  )

  return (
    <List
      loading={loading}
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
