import { Redirect, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import Header from '~/components/admin/Header'
import Breadcrumb from '~/components/admin/Breadcrumb'
import CenterContainer from '~/components/CenterContainer'
import { setNextURL } from '~/utils/redirect'

const headerMargin = {
  marginTop: '10px'
}

const AdminLayout = ({ children }) => {
  const { location } = useHistory()
  const { AuthStore: { isLoggedIn, token } } = useStore()
  if (!isLoggedIn || !token.accessToken) {
    let q = ''
    if (!setNextURL(location.pathname))
      q = `?nextURL=${encodeURIComponent(location.pathname)}`
    return <Redirect to={`/admin/login${q}`} />
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
