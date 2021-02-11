import { Col, List, Avatar } from 'antd'
import { observer } from 'mobx-react-lite'
import { testerStatuses } from '~/utils/const'

const ListView = ({ pageSize = 8, testers = [] }) => {
  return (
    <Col span={24}>
      <List
        grid={{ column: 2 }}
        dataSource={testers}
        renderItem={tester => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={tester.lastSnapshot?.url || tester.avatar} size="large" />}
              title={<a href={`testers/${tester._id}`}>{ tester.name }</a>}
              description={<>{ testerStatuses[tester.status] }</>}
            />
          </List.Item>
        )}
      />
    </Col>
  )
}

export default observer(ListView)
