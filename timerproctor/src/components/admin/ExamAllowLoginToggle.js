import { useCallback, useState } from 'react'
import { Tooltip, Switch, message } from 'antd'
import { CloseOutlined, CheckOutlined, InfoCircleFilled } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { fetchAPIwithAdminToken } from '~/utils/api'

const ExamAllowLoginToggle = ({ disabled = false }) => {
  const { ExamStore: exam } = useStore()

  const [loading, setLoading] = useState(false)
  const updateAllowLogin = useCallback(async allow => {
    try {
      setLoading(true)
      const res = await fetchAPIwithAdminToken(`/exams/${exam?.id}/allowLogin`, { allow }, 'PUT')
      const { status, message: msg } = res
      if (status === 'ok') {
        message.success(msg)
        exam.timeWindow.realtime.allowLogin = allow
        setLoading(false)
      } else {
        setLoading(false)
        throw new Error(msg || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
      }
    } catch (err) {
      setLoading(false)
      message.error(err.message || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
    }
  }, [exam?.id])

  const allowLogin = exam?.timeWindow?.realtime?.allowLogin || false
  const defaultTooltip = exam.status === 'started' ? 'อนุญาตให้ผู้เข้าสอบเข้ามาในห้องสอบเพิ่มเติมได้อยู่' : 'อนุญาตให้ผู้เข้าสอบเข้าสู่ระบบมารอในห้องสอบก่อนเริ่มได้'
  const tooltip = disabled ? 'ปรับได้เฉพาะอาจารย์เจ้าของการสอบ' : defaultTooltip
  return (
    <Tooltip placement="topLeft" title={tooltip} color={disabled ? 'red' : null}>
      <Switch
        disabled={disabled}
        loading={loading}
        checked={allowLogin}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        onChange={updateAllowLogin}
      />{' '}
      อนุญาตให้เข้าห้องสอบได้ {disabled ? null: <InfoCircleFilled />}
    </Tooltip>
  )
}

export default observer(ExamAllowLoginToggle)
