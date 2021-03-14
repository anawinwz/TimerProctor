import { Checkbox, Form, Radio, Table } from 'antd'

const GridField = ({ info }) => {
  const { rows = [], columns = [] } = info

  const renderedColumns = columns.length === 0 ? [] : [
    {
      title: '',
      key: 'title',
      dataIndex: 'title'
    },
    {
      title: '',
      key: 'options',
      render: (_, record) => {
        const Input = record.type === 'checkbox' ? Checkbox : Radio
        return (
          <Form.Item name={`answer_${record.id}:${record.type}`} noStyle>
            <Input.Group options={columns} />
          </Form.Item>
        )
      }
    }
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
