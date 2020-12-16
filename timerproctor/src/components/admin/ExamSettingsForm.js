import { Form, Divider, Radio, Checkbox, DatePicker, InputNumber, Switch, Input, Select, Button } from 'antd'

const formLayout = { 
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const timeWindowModes = [
  { label: 'ให้สัญญาณเริ่ม-สิ้นสุดด้วยตนเอง', value: 'realtime' },
  { label: 'กำหนดล่วงหน้า', value: 'schedule' },
]
const loginMethods = [
  { label: 'บัญชี Google', value: 'google' },
]
const idCheckModes = [
  { label: 'ปิด', value: 'off' },
  { label: 'อนุมัติก่อนเข้าสอบ', value: 'prompt' },
  { label: 'ตรวจภายหลัง', value: 'post' },
]

const ExamSettingsForm = () => {
  return (
    <Form
      {...formLayout}
      size="middle"
    >
      <Divider plain>ทั่วไป</Divider>
      <Form.Item label="วิธีกำหนดเวลาสอบ" name={['timeWindow', 'mode']} initialValue="schedule">
        <Radio.Group
          options={timeWindowModes}
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
      <Form.Item label="แสดงนาฬิกาจับเวลา" name={['timer', 'isShow']}>
        <Switch />
      </Form.Item>
      <Form.Item label="คำชี้แจง" name={['desc']}>
        <Input.TextArea />
      </Form.Item>

      <Divider plain>การยืนยันตนผู้เข้าสอบ</Divider>
      <Form.Item label="ต้องเข้าสู่ระบบก่อน" name={['authentication', 'loginMethods']} initialValue={['google']}>
        <Checkbox.Group
          options={loginMethods}
        />
      </Form.Item>
      <Form.Item label="ตรวจสอบบัตรประจำตัว" name={['authentication', 'idCheckMode']} initialValue="prompt">
        <Radio.Group
          options={idCheckModes}
          optionType="button"
        />
      </Form.Item>

      <Divider plain>กรรมการคุมสอบ</Divider>
      <Form.Item name={['proctors']} wrapperCol={{ span: 24 }}>
        <Select mode="tags" placeholder="เลือกกรรมการคุมสอบ">
          <Option value="a@ku.th">a@ku.th</Option>
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

export default ExamSettingsForm
