import { Avatar } from 'antd'
import styled from 'styled-components'

const NoSelectAvatar = styled(Avatar)`
  user-select: none;
  cursor: default;
`

const UserAvatar = (props) => {
  const { user, ...otherProps } = props

  if (user?.avatar) return <NoSelectAvatar {...otherProps} src={user.avatar} />
  return (
    <NoSelectAvatar {...otherProps} style={{ backgroundColor: 'green' }}>
      { user.name }
    </NoSelectAvatar>
  )
}

export default UserAvatar
