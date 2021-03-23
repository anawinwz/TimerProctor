import { Table } from 'antd'
import { observer } from 'mobx-react-lite'
import { isEventRisk } from 'utils/const'

import { testerEventsType } from '~/utils/const'
import { dateStr, dateSorter } from '~/utils/date'

const typeFilters = Object.entries(testerEventsType)
  .map(([value, text]) => ({ text, value }))

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
    render: text => testerEventsType?.[text] || text,
    filters: typeFilters,
    onFilter: (value, record) => record.type === value
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
        case 'snapshot': return <a href={evidence.url} target="_blank">ดูรูปภาพ</a>
        case 'face':
          switch (info.facesCount) {
            case 0: return 'ไม่พบใบหน้า'
            case 1: return info.timeDiff ? `กลับมาพบ 1 ใบหน้าอีกครั้ง (หายไป ${info.timeDiff/1000} วินาที)` : 'พบ 1 ใบหน้า'
            default: return `พบ ${info.facesCount} ใบหน้า`
          }
        case 'socket':
          const { name, info: eventInfo } = info.socketEvent
          switch (name) {
            case 'authorized': return 'เชื่อมต่อสำเร็จ'
            case 'disconnect':
              switch (eventInfo) {
                case 'client namespace disconnect': return 'ปลายทางขอตัดการเชื่อมต่อเอง'
                case 'ping timeout': return 'ไม่ตอบสนองในเวลาที่กำหนด (เน็ตช้า)'
                case 'transport close': return 'การเชื่อมต่อขาดหาย (หลุด หรือสลับ 3G/4G <-> Wi-Fi)'
                default: return 'ไม่ทราบรายละเอียด'
              }
            default: return 'ไม่ทราบรายละเอียด'
          }
          break
        default: return `ไม่ทราบรายละเอียด`
      }
    }
  }
]

const TesterEventsTable = ({ events }) => {
  return (
    <Table
      size="small"
      rowClassName={event => isEventRisk(event) ? 'risk' : ''}
      columns={columns}
      dataSource={events}
      rowKey="_id"
    />
  )
}

export default observer(TesterEventsTable)
