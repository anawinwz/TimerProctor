import { useMemo } from 'react'
import { Popover, List } from 'antd'
import styled from 'styled-components'

import UserAvatar from '../UserAvatar'

const PopoverHeader = styled('div')`
  .ant-avatar {
    margin-bottom: 5px;
  }
  .user-name {
    margin-bottom: 0px;
    font-weight: bold;
  }
  .user-role {
    color: gray;
  }
`

const PopoverContent = ({ user }) => {
  const popoverList = useMemo(() => 
    [
      { type: 'avatar' },
      { type: 'menu', name: 'ออกจากระบบ' }
    ]
  , [])
  return (
    <List
      dataSource={popoverList}
      renderItem={(item) => {
        switch (item.type) {
          case 'avatar': {
            return (
              <List.Item>
                <PopoverHeader>
                  <UserAvatar user={user} />
                  <p className="user-name">{ user.name }</p>
                  <span className="user-role">{ user.role?.name }</span>
                </PopoverHeader>
              </List.Item>
            )
            break
          }
          case 'menu':
            return <List.Item><a href="#">{ item.name }</a></List.Item>
        }
      }}
    />
  )
}


const UserPopover = ({ user }) => {

  return (
    <Popover
      placement="bottomLeft"
      content={<PopoverContent user={user} />}
    >
      <UserAvatar user={user} />
    </Popover>
  )
}

export default UserPopover