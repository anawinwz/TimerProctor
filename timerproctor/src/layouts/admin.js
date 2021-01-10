import { Redirect } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import Header from '~/components/admin/Header'
import Breadcrumb from '~/components/admin/Breadcrumb'
import CenterContainer from '~/components/CenterContainer'

const headerMargin = {
  marginTop: '10px'
}

const AdminLayout = ({ children }) => {
  const { AuthStore: { isLoggedIn } } = useStore()
  if (!isLoggedIn) return <Redirect to="/admin/login" />
  return (
    <>
      <Header fixed={true} />
      <CenterContainer full={false} style={headerMargin}>
        <Breadcrumb />
        { children }
      </CenterContainer>
    </>
  )
}

export default observer(AdminLayout)
