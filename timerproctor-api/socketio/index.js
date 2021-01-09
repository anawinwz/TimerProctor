import testtakerBind from './testtaker'
import proctorBind from './proctor'

const bindSocketListener = (socket, role = 'testtaker', user = {}) => {
  if (role === 'testtaker') testtakerBind(socket, user)
  else proctorBind(socket, user)
}

export default bindSocketListener