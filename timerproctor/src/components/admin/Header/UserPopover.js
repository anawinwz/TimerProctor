import { useMemo } from 'react'
import { Popover, List } from 'antd'
import styled from 'styled-components'

import { observer } from 'mobx-react'
import { useStore } from '../../../stores/admin'

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
                  <span className="user-role">{ user.email }</span>
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


const UserPopover = () => {
  const { AuthStore: auth } = useStore()
  const user = useMemo(() => ({
    name: auth.displayName,
    email: auth.email,
    avatar: auth.photoURL
  }), [auth])

  return (
    <Popover
      placement="bottomLeft"
      content={<PopoverContent user={user} />}
    >
      <UserAvatar user={user} />
    </Popover>
  )
}

export default observer(UserPopover)