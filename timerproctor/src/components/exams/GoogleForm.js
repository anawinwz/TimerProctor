import { useState, useCallback } from 'react'
import { Form, Typography, Space, Input, InputNumber, Select, Radio, Checkbox, DatePicker, Button, TimePicker } from 'antd'
import YouTube from 'react-youtube'
import { validateMessages, validators } from '~/utils/form'

const verticalChoices = {
  display: 'block',
  height: '35px',
  lineHeight: '35px',
  fontSize: '16px'
}

const placeholderText = 'คำตอบของคุณ'

const GoogleForm = ({ form, onCompleted }) => {
  const [ sectionIdx, setSectionIdx ] = useState(0)

  const { sections } = form
  const isLastSection = sectionIdx + 1 === sections.length

  const fields = sections[sectionIdx]
  
  const goBack = useCallback(() => setSectionIdx(prev => prev - 1))
  const goNext = useCallback(() => setSectionIdx(prev => prev + 1))

  return (
    <Form
      layout="vertical"
      validateMessages={validateMessages}
      size="large"
      onFinish={onCompleted}
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
              ItemComponent = isNumber ? <InputNumber placeholder={placeholderText} style={{ width: '100%' }} /> : <Input placeholder={placeholderText} />
            break
            case 'paragraph':
              ItemComponent = <Input.TextArea placeholder={placeholderText} />
              break
            case 'dropdown':
              SubComponent = Select
            case 'checkbox':
              if (!SubComponent) SubComponent = Checkbox.Group
            case 'multipleChoice':
              if (!SubComponent) SubComponent = Radio.Group
              
              const options = field.answers.map(answer => ({
                label: answer ? answer : <>อื่นๆ <Input disabled /></>,
                value: answer,
                disabled: !answer,
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
              name={field.id ? `answer_${field.id}` : undefined}
              label={<Space direction="vertical">
                <Typography.Title level={field.type === 'title' ? 4 : 5} style={{ margin: 0 }}>{ field.title }</Typography.Title>
                { field.type !== 'youtube' && <Typography.Text type="secondary">{ field.desc }</Typography.Text> }
              </Space>}
              extra={field.type === 'youtube' ? field.desc : ''}
              rules={field.rules}
            >
              { ItemComponent }
            </Form.Item>
          )
        })
      }
      <Form.Item>
        {sectionIdx > 0 && <Button type="ghost" onClick={goBack}>{'< ส่วนก่อนหน้า'}</Button> }
        <Button type="primary" htmlType={isLastSection ? 'submit' : 'button'} onClick={isLastSection ? undefined : goNext}>
          {isLastSection ? 'ส่งคำตอบ' : 'ส่วนต่อไป >' }
        </Button>
      </Form.Item>
    </Form>
  )
}

export default GoogleForm
