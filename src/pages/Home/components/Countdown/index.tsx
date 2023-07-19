import { useContext, useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import { CountdownContainer, Separator } from './styles'
import { CyclesContext } from '../..'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    amountSecondsPassed,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  // padStart: nesse caso a string sempre tem que ter tamanho , caso contrário o padStart irá preencher com '0' até chegar no tamanho desejado
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // sempre que usamos uma variável externa, devemos incluir ela como dependencia do useEffect dentro dos colchetes
  useEffect(() => {
    let interval: number

    // só quero fazer a redução do countdown se tiver um ciclo ativo
    if (activeCycle) {
      interval = setInterval(() => {
        // calculando a diferença de segundos que se passaram desde a data atual pra data que começou o ciclo dentro do intervalo de 1 segundo
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        // compara pra ver se já chegou no zero, caso sim, terminou o contador, caso contrario, continua mudando os minutos/segundos
        if (secondsDifference >= totalSeconds) {
          // percorre o objeto e acha o ciclo ativo para mudar a data que foi interrompido
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)

          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // retorno do useEffect sempre será uma função
    // nesse caso o useEffect será chamado toda vez que a activeCycle mudar, portanto quando chamar o useEffect de novo, vou fazer o clearInterval
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, totalSeconds, markCurrentCycleAsFinished])

  // coloca o timer no title da página também
  useEffect(() => {
    if (activeCycle) {
      document.title = `Ignite Timer - ${minutes}:${seconds}`
    }
  }, [minutes, seconds])

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
