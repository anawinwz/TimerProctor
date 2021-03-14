import { Form, Table } from 'antd'

const GridField = ({ info }) => {
  const { rows = [], columns = [] } = info

  const renderedColumns = columns.length === 0 ? [] : [
    {
      title: '',
      key: 'title',
      dataIndex: 'title'
    },
    ...columns.map(column => {
      return {
        title: column,
        key: column,
        render: (_, record) => {
          const type = record.type
          return <Form.Item name={`answer_${record.id}:${type}`} noStyle><input type={type} name={`answer_${record.id}:${type}`} /></Form.Item>
        }
      }
    })
  ]

  return (
    <Table
      dataSource={rows}
      columns={renderedColumns}
      pagination={false}
    />
  )
}

export default GridField
