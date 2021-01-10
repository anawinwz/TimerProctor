import { useEffect } from 'react' 
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'
import FailedCard from '~/components/exams/FailedCard'

const FailedPage = () => {
  const { SocketStore: socketStore } = useStore()
  useEffect(() => socketStore.socket.emit('fail'), [])
    
  return (
    <>
      <FailedCard />
    </>
  )
}

export default observer(FailedPage)
