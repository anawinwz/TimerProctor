import { useState, useCallback } from 'react'
import { Form, Typography, Space, Input, InputNumber, Select, Radio, Checkbox, DatePicker, Button, TimePicker } from 'antd'
import YouTube from 'react-youtube'
import styled from 'styled-components'
import { validateMessages, validators } from '~/utils/form'
import { getVW } from '~/utils/dom'
import { isMoment } from '~/utils/date'
import GridField from './GridField'

const StyledForm = styled(Form)`
  .ant-form-item {
    background: rgb(250, 250, 250);
    padding: 10px 15px;
    border-radius: 5px;
  }
  .ant-form-item-with-help { margin-bottom: 24px; }
  .ant-col-0 { display: none !important; }
  .scale-label { margin-left: 10px; margin-right: 10px; }
`

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
  
  const goBack = useCallback(() => setSectionIdx(prev => prev - 1))
  const goNext = useCallback(() => setSectionIdx(prev => prev + 1))
  const onFinish = useCallback(fieldValues => {
    let values = {}
    for (const [typedKey, val] of Object.entries(fieldValues)) {
      const [key, type] = typedKey.split(':')
      values[key] = val
      if (isMoment(val)) {
        let timeInfo = {}
        
        if (type.startsWith('date')) {
          if (type.includes('-year')) timeInfo.year = val.year()
          timeInfo.month = val.month() + 1
          timeInfo.day = val.day()
        }
        
        if (type.startsWith('time') || type.includes('-time')) {
          timeInfo.hour = val.hour()
          timeInfo.minute = val.minute()
          if (type.includes('-duration')) timeInfo.second = val.second()
        }
        
        values[key] = timeInfo
      }
    }
    onCompleted(values)
  }, [])

  return (
    <StyledForm
      name="googleForms"
      layout="vertical"
      validateMessages={validateMessages}
      size="large"
      onFinish={onFinish}
    >
      {
        Object.entries(sections).map(([idx, fields]) => {
          return (
            <div key={`section${idx}`} className={idx != sectionIdx ? 'hidden' : ''}>
            {
              fields.map(field => {
                const { type } = field
                const colonType = `${type}${field.showTime ? '-time' : ''}${field.showYear ? '-year' : ''}${field.isDuration ? '-duration' : ''}`

                let isNumber = false
                field.rules = field.rules || []
                for (const idx in field.rules) {
                  if (['number', 'integer'].includes(field.rules[idx]?.type)) isNumber = true
                  if (!field.rules[idx].validator) continue

                  const { name, values } = field.rules[idx].validator
                  field.rules[idx].validator = (validators[name]) ? validators[name](values) : () => Promise.resolve()
                }
                
                let ItemComponent = null, SubComponent = null, moreProps = {}
                switch (type) {
                  case 'shortAnswer':
                    ItemComponent = isNumber ? <InputNumber placeholder={placeholderText} style={{ width: '100%' }} /> : <Input placeholder={placeholderText} />
                  break
                  case 'paragraph':
                    ItemComponent = <Input.TextArea placeholder={placeholderText} />
                    break
                  case 'dropdown':
                    SubComponent = Select
                    moreProps = { placeholder: 'เลือก', allowClear: true }
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
                    ItemComponent = <SubComponent options={options} {...moreProps} />
                    break
                  case 'linearScale':
                    ItemComponent = <Radio.Group>
                      <label className="scale-label">{ field.labels.min }</label>
                      { field.answers.map(answer => <Radio.Button value={answer}>{ answer }</Radio.Button> )}
                      <label className="scale-label">{ field.labels.max }</label>
                    </Radio.Group>
                    break
                  case 'date':
                    ItemComponent = <DatePicker 
                      showTime={field.showTime}
                      format={`${field.showYear ? 'YYYY-' : ''}MM-DD${field.showTime ? ' HH:mm' : ''}`}
                    />
                    break
                  case 'time':
                    ItemComponent = <TimePicker format={`HH:mm${field.isDuration ? ':ss' : ''}`} showNow={!field.isDuration} />
                    break
                  case 'youtube': 
                    ItemComponent = <YouTube
                      videoId={field.media.id}
                      opts={{
                        width: Math.min(field.media.width || 0, getVW() - 80),
                        height: field.media.height
                      }}
                    />
                    break
                  case 'grid':
                    ItemComponent = <GridField info={field} />
                    break
                  default:
                    break
                }

                return (
                  <Form.Item
                    key={field.id || field.title}
                    name={field.id ? `answer_${field.id}:${colonType}` : undefined}
                    label={<Space direction="vertical">
                      <Typography.Title level={field.type === 'title' ? 4 : 5} style={{ margin: 0 }}>{ field.title }</Typography.Title>
                      { field.type !== 'youtube' && <Typography.Text type="secondary">{ field.desc }</Typography.Text> }
                    </Space>}
                    extra={field.type === 'youtube' ? field.desc : ''}
                    rules={field.rules}
                    wrapperCol={!ItemComponent ? { span: 0 } : undefined}
                  >
                    { ItemComponent }
                  </Form.Item>
                )
              })
            }
            </div>
          )
        })
      }
      <Form.Item>
        {sectionIdx > 0 && <Button type="ghost" onClick={goBack}>{'< ส่วนก่อนหน้า'}</Button> }
        <Button type="primary" htmlType={isLastSection ? 'submit' : 'button'} onClick={isLastSection ? undefined : goNext}>
          {isLastSection ? 'ส่งคำตอบ' : 'ส่วนต่อไป >' }
        </Button>
      </Form.Item>
    </StyledForm>
  )
}

export default GoogleForm
