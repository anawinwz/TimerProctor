import { useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Popover, List } from 'antd'
import styled from 'styled-components'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

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

const PopoverContent = ({ user = {}, onLogout = () => {} }) => {
  const popoverList = useMemo(() => 
    [
      { type: 'avatar' },
      { type: 'menu', name: 'ออกจากระบบ', onClick: onLogout }
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
            return <List.Item><a onClick={item.onClick}>{ item.name }</a></List.Item>
        }
      }}
    />
  )
}


const UserPopover = () => {
  const { AuthStore: auth } = useStore()
  const history = useHistory()
  const user = useMemo(() => ({
    name: auth.displayName,
    email: auth.email,
    avatar: auth.photoURL
  }), [auth.userId])

  const logout = useCallback(async () => {
    await auth.logout()
    history.push('/admin/login')
  }, [])

  return (
    <Popover
      placement="bottomLeft"
      content={<PopoverContent user={user} onLogout={logout} />}
    >
      <UserAvatar user={user} />
    </Popover>
  )
}

export default observer(UserPopover)