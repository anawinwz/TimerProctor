import { DeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { useStore } from '~/stores/admin'
import { observer } from 'mobx-react-lite'

const DeleteButton = () => {
  const { ExamAdminStore: examAdmin } = useStore()

  return (
    <Button
      type="primary"
      danger
      icon={<DeleteOutlined />}
      disabled={examAdmin?.testerIdMappings?.length === 0}
    >
      ลบทั้งหมด
    </Button>
  )
}

export default observer(DeleteButton)
