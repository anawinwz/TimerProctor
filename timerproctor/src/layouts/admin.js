import Header from '../components/admin/Header'
import CenterContainer from '../components/CenterContainer'

const headerMargin = {
  marginTop: '10px'
}

const AdminLayout = ({ children }) => (
  <>
    <Header fixed={true} />
    <CenterContainer full={false} style={headerMargin}>
      { children }
    </CenterContainer>
  </>
)

export default AdminLayout
