import { Table } from 'antd'
import { observer } from 'mobx-react-lite'

import { dateStr, dateSorter } from '~/utils/date'

const riskEventMarker = event => {
  const { type, info } = event
  switch (type) {
    case 'window':
      if (info.windowEvent === 'unfocus') return 'risk'
    case 'snapshot':
      if (info.facesCount == 0) return 'risk'
    default: return ''
  }
}

const columns = [
  {
    title: 'วัน-เวลาเหตุการณ์',
    dataIndex: 'timestamp',
    key: 'timestamp',
    sorter: (a, b) => dateSorter(a.timestamp, b.timestamp),
    defaultSortOrder: 'descend',
    sortDirections: ['ascend', 'descend', 'ascend'],
    render: text => dateStr(text, 'fullS')
  },
  {
    title: 'ประเภทเหตุการณ์',
    dataIndex: 'type',
    key: 'type',
    filters: []
  },
  {
    title: 'รายละเอียด',
    dataIndex: 'info',
    key: 'info',
    width: '50%',
    render: (_, row) => {
      const { type, info, evidence } = row
      switch (type) {
        case 'window':
          switch (info.windowEvent) {
            case 'focus': return `กลับมายังหน้าทำข้อสอบอีกครั้ง (หายไป ${info.timeDiff/1000} วินาที)`
            case 'unfocus': return `มีการสลับแท็บ/หน้าต่างเกิดขึ้น`
            default: return `ไม่ทราบรายละเอียด`
          }
        case 'snapshot': return `ภาพมี ${info.facesCount} ใบหน้า`
        default: return `ไม่ทราบรายละเอียด`
      }
    }
  }
]

const TesterEventsTable = ({ events }) => {
  return (
    <Table
      size="small"
      rowClassName={riskEventMarker}
      columns={columns}
      dataSource={events}
    />
  )
}

export default observer(TesterEventsTable)
