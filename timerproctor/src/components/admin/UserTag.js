import { Space, Typography } from 'antd'
import UserAvatar from './UserAvatar'

const UserTag = ({ user }) => {
  return (
    <Space direction="horizontal">
      <UserAvatar user={user} size="small" />
      <Typography.Text ellipsis>{ user?.name || 'ไม่ทราบชื่อ' }</Typography.Text>
    </Space>
  )
}

export default UserTag
