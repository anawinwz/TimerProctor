import { Form, Divider, Radio, Checkbox, DatePicker, InputNumber, Switch, Input, Select, Button } from 'antd'

import { observer } from 'mobx-react'
import { useStore } from '../../stores/admin'

import { timeWindowModes, loginMethods, idCheckModes } from '../../utils/const'
import { toOptions } from '../../utils/form'

const formLayout = { 
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const opt_timeWindowModes = toOptions(timeWindowModes)
const opt_loginMethods = toOptions(loginMethods)
const opt_idCheckModes = toOptions(idCheckModes)

const ExamSettingsForm = () => {
  const { ExamStore: exam } = useStore()
  return (
    <Form
      {...formLayout}
      size="middle"
      initialValues={exam.info}
    >
      <Divider plain>ทั่วไป</Divider>
      <Form.Item label="วิธีกำหนดเวลาสอบ" name={['timeWindow', 'mode']} initialValue="schedule">
        <Radio.Group
          options={opt_timeWindowModes}
          optionType="button"
        />
      </Form.Item>
      <Form.Item label="วัน-เวลาเริ่มการสอบ" name={['timeWindow', 'schedule', 'startDate']}>
        <DatePicker showTime />
      </Form.Item>
      <Form.Item label="วัน-เวลาสิ้นสุดการสอบ" name={['timeWindow', 'schedule', 'endDate']}>
        <DatePicker showTime />
      </Form.Item>
      <Form.Item label="จำกัดเวลาทำ (นาที)" name={['timer', 'duration']} initialValue={50}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="แสดงนาฬิกาจับเวลา" name={['timer', 'isShow']} valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="คำชี้แจง" name={['desc']}>
        <Input.TextArea />
      </Form.Item>

      <Divider plain>การยืนยันตนผู้เข้าสอบ</Divider>
      <Form.Item label="ต้องเข้าสู่ระบบก่อน" name={['authentication', 'loginMethods']} initialValue={['google']}>
        <Checkbox.Group
          options={opt_loginMethods}
        />
      </Form.Item>
      <Form.Item label="ตรวจสอบบัตรประจำตัว" name={['authentication', 'idCheckMode']} initialValue="prompt">
        <Radio.Group
          options={opt_idCheckModes}
          optionType="button"
        />
      </Form.Item>

      <Divider plain>กรรมการคุมสอบ</Divider>
      <Form.Item name={['proctors']} wrapperCol={{ span: 24 }}>
        <Select mode="tags" placeholder="เลือกกรรมการคุมสอบ">
          <Select.Option value="a@ku.th">a@ku.th</Select.Option>
        </Select>
      </Form.Item>
      
      <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          บันทึกการตั้งค่า
        </Button>
      </Form.Item>
    </Form>
  )
}

export default observer(ExamSettingsForm)
