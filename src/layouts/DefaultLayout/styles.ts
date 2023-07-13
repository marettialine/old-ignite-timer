import styled from 'styled-components'

export const LayoutContainer = styled.div`
  max-width: 74rem;
  height: auto;
  margin: 5rem auto;
  padding: 5rem;

  background-color: ${(props) => props.theme['gray-800']};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`
