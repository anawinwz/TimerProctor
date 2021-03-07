import { Redirect, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import Header from '~/components/admin/Header'
import Breadcrumb from '~/components/admin/Breadcrumb'
import CenterContainer from '~/components/CenterContainer'

const headerMargin = {
  marginTop: '10px'
}

const AdminLayout = ({ children }) => {
  const { location } = useHistory()
  const { AuthStore: { isLoggedIn, token } } = useStore()
  if (!isLoggedIn || !token.accessToken) {
    if (typeof window !== 'undefined') window.sessionStorage.setItem('nextURL', location.pathname)
    return <Redirect to="/admin/login" />
  }
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
