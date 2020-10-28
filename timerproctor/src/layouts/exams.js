import Header from '../components/exams/Header'
import CenterContainer from '../components/CenterContainer'
const exams = ({ children }) => (
  <>
    <Header />
    <CenterContainer full>
      { children }
    </CenterContainer>
  </>
)

export default exams
