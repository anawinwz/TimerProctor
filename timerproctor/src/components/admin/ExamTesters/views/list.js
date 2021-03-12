import { Col, List, Avatar } from 'antd'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { testerStatuses } from '~/utils/const'

const ListView = ({ pageSize = 8, testers = [], noDescription = false }) => {
  return (
    <Col span={24}>
      <List
        grid={{ xs: 1, md: 2 }}
        dataSource={testers}
        renderItem={tester => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={tester.lastSnapshot?.url || tester.avatar} size="large" />}
              title={<Link to={`testers/${tester._id}`}>{ tester.name }</Link>}
              description={<>{ noDescription ? '' : testerStatuses[tester.status] }</>}
            />
          </List.Item>
        )}
      />
    </Col>
  )
}

export default observer(ListView)
