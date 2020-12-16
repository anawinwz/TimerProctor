import Header from '../components/admin/Header'
import Breadcrumb from '../components/admin/Breadcrumb'
import CenterContainer from '../components/CenterContainer'

const headerMargin = {
  marginTop: '10px'
}

const AdminLayout = ({ children }) => (
  <>
    <Header fixed={true} />
    <CenterContainer full={false} style={headerMargin}>
      <Breadcrumb />
      { children }
    </CenterContainer>
  </>
)

export default AdminLayout
