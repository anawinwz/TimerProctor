import { Avatar } from 'antd'

const UserAvatar = (props) => {
  const { user, ...otherProps } = props

  if (user?.avatar) return <Avatar {...otherProps} src={user.avatar} />
  return (
    <Avatar {...otherProps} style={{ backgroundColor: 'green' }}>
      { user.name }
    </Avatar>
  )
}

export default UserAvatar
