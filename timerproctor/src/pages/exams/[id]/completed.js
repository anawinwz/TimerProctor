import { useEffect } from 'react' 
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'
import CompletedCard from '~/components/exams/CompletedCard'

const CompletedPage = () => {
  const { SocketStore: socketStore } = useStore()
  useEffect(() => socketStore.socket.emit('complete'), [])
  return (
    <>
      <CompletedCard />
    </>
  )
}

export default observer(CompletedPage)
