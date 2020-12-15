import Header from '../components/exams/Header'
import CenterContainer from '../components/CenterContainer'

const headerMargin = {
  marginTop: '10px'
}

const ExamLayout = ({ children, full = true }) => (
  <>
    <Header fixed={full} />
    <CenterContainer full={full} style={full ? {} : headerMargin}>
      { children }
    </CenterContainer>
  </>
)

export const ExamNormalLayout = ({ children }) => (
  <ExamLayout full={false}>{ children }</ExamLayout>
)

export default ExamLayout
