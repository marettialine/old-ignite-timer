import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  return (
    <CountdownContainer>
      <span>
        {
          minutes[0] // Posso trabalhar com string como fossem vetores, nesse caso irá retornar o primeiro valor da string
        }
      </span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
