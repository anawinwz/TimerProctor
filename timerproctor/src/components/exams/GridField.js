import { Checkbox, Form, Radio, Table } from 'antd'

const customGroupStyles = {
  tableLayout: 'fixed'
}

const GridField = ({ info }) => {
  const { rows = [], columns = [] } = info

  const renderedColumns = columns.length === 0 ? [] : [
    {
      title: '',
      key: 'title',
      dataIndex: 'title'
    },
    {
      title: <table style={customGroupStyles}><tr>{ columns.map(column => <td>{ column }</td>) }</tr></table>,
      key: 'options',
      render: (_, record) => {
        const Input = record.type === 'checkbox' ? Checkbox : Radio
        return (
          <Form.Item name={`answer_${record.id}:${record.type}`} noStyle rules={record.rules}>
            <Input.Group>
              <table style={customGroupStyles}><tr>{ columns.map(column => <td><Input value={column} /></td>) }</tr></table>
            </Input.Group>
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
