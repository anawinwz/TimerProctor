import styled from 'styled-components'

const sizes = {
  normal: 24,
  large: 36
}

const LogoContainer = styled.div`
  user-select: none;
  font-weight: bold;
  font-size: ${props => props.size ? sizes[props.size] : sizes.normal}px;
  color: black;
`

const Logo = (props) => <LogoContainer {...props}>TimerProctor</LogoContainer>

export default Logo
