import styled from 'styled-components'
import { Typography } from 'antd'

import UserAvatar from './UserAvatar'

const Wrapper = styled('div')`
  width: 100%;
  .ant-avatar {
    margin-right: 8px;
  }
  .ant-typography {
    width: 75%;
  }
`

const UserTag = ({ user }) => {
  return (
    <Wrapper>
      <UserAvatar user={user} size="small" />
      <Typography.Text ellipsis>{ user?.name || 'ไม่ทราบชื่อ' }</Typography.Text>
    </Wrapper>
  )
}

export default UserTag
