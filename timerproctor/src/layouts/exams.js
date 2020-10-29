import Header from '../components/exams/Header'
import CenterContainer from '../components/CenterContainer'

const headerMargin = {
  marginTop: '10px'
}

const exams = ({ children, full = true }) => (
  <>
    <Header fixed={full} />
    <CenterContainer full={full} style={full ? {} : headerMargin}>
      { children }
    </CenterContainer>
  </>
)

export const ExamNormalLayout = ({ children }) => exams({ children, full: false })

export default exams
