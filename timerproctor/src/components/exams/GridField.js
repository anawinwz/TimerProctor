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
      dataIndex: 'title',
      render: (text, record) => {
        const isRequired = record.rules?.[0]?.required === true
        return (
          <span className="ant-form-item-label">
            <label className={isRequired ? 'ant-form-item-required' : ''}>{ text }</label>
          </span>
        )
      }
    },
    {
      title: <table style={customGroupStyles}>
        <tbody>
          <tr>{ columns.map(column => <td key={`th_${column}`}>{ column }</td>) }</tr>
        </tbody>
      </table>,
      key: 'options',
      render: (_, record) => {
        const Input = record.type === 'checkbox' ? Checkbox : Radio
        return (
          <Form.Item name={`answer_${record.id}:${record.type}`} noStyle rules={record.rules}>
            <Input.Group>
              <table style={customGroupStyles}>
                <tbody>
                  <tr>
                    { columns.map(column => <td key={`inp_${record.id}_${column}`}>
                        <Input value={column} />
                      </td>) }
                  </tr>
                </tbody>
              </table>
            </Input.Group>
          </Form.Item>
        )
      }
    }
  ]

  return (
    <Table
      tableLayout="fixed"
      rowKey="id"
      dataSource={rows}
      columns={renderedColumns}
      pagination={false}
    />
  )
}

export default GridField
