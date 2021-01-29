import { Form, Typography, Space, Input, InputNumber, Select, Radio, Checkbox, DatePicker, Button, TimePicker } from 'antd'
import YouTube from 'react-youtube'
import { validators } from '~/utils/form'

const verticalChoices = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

const GoogleForm = ({ form, onCompleted }) => {
  const fields = form.fields
  return (
    <Form
      layout="vertical"
      validateMessages={{ required: 'คำถามนี้จำเป็นต้องตอบ' }}
    >
      {
        fields.map(field => {
          const { type } = field

          let isNumber = false
          field.rules = field.rules || []
          for (const idx in field.rules) {
            if (field.rules[idx]?.type === 'number') isNumber = true
            if (!field.rules[idx].validator) continue

            const { name, values } = field.rules[idx].validator
            field.rules[idx].validator = (validators[name]) ? validators[name](values) : () => Promise.resolve()
          }
          
          let ItemComponent, SubComponent
          switch (type) {
            case 'shortAnswer':
              ItemComponent = isNumber ? <InputNumber style={{ width: '100%' }} /> : <Input />
            break
            case 'paragraph':
              ItemComponent = <Input.TextArea />
              break
            case 'dropdown':
              SubComponent = Select
            case 'checkbox':
              if (!SubComponent) SubComponent = Checkbox.Group
            case 'multipleChoice':
              if (!SubComponent) SubComponent = Radio.Group
              
              const options = field.answers.map(answer => ({
                label: answer,
                value: answer,
                style: verticalChoices
              }))
              ItemComponent = <SubComponent options={options} />
              break
            case 'date':
              ItemComponent = <DatePicker showTime={field.showTime} />
              break
            case 'time':
              ItemComponent = <TimePicker />
              break
            case 'youtube': 
              ItemComponent = <YouTube
                videoId={field.media.id}
                opts={{
                  width: field.media.width,
                  height: field.media.height
                }}
              />
              break
            default:
              ItemComponent = <></>
          }

          return (
            <Form.Item
              name={field.id}
              label={<Space direction="vertical">
                <Typography.Title level={field.type === 'title' ? 4 : 5} style={{ margin: 0 }}>{ field.title }</Typography.Title>
                <Typography.Text type="secondary">{ field.desc }</Typography.Text>
              </Space>}
              rules={field.rules}
            >
              { ItemComponent }
            </Form.Item>
          )
        })
      }
      <Form.Item>
        <Button type="primary" htmlType="submit" size="large">ส่งคำตอบ</Button>
      </Form.Item>
    </Form>
  )
}

export default GoogleForm
