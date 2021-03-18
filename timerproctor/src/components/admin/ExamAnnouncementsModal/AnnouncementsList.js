import { List } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useStore } from 'stores/admin'
import { shortDateStr } from 'utils/date'

const AnnouncementsList = () => {
  const [loading, setLoading] = useState(true)
  const { ExamStore: exam } = useStore()

  useState(async () => {
    await exam.getAnnouncements()
    setLoading(false)
  }, [])

  return (
    <List
      loading={loading}
      dataSource={exam.announcements}
      size="small"
      renderItem={item => 
        <List.Item>
          { item.content }
          <List.Item.Meta description={shortDateStr(item.createdAt)} />
        </List.Item>
      }
    />
  )
}

export default observer(AnnouncementsList)
