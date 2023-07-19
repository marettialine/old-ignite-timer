import { ChangeEvent, useEffect, useState } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // Não possui export default, por isso * as zod, caso contrário teria que colocar entre {} cada coisa que queríamos importar
import { differenceInSeconds } from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'

// Schema: definir um formato e validar dados de um formulário baseado nesse formato
// zod.object: foi usado object pois o retorno do nosso fomrulário é um objeto (data)
const newCycleFormValidationSchema = zod.object({
  // task tem que ser string com pelo menos uma tarefa, caso contrário mensagem de aviso
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

// interface: melhor para definir o objeto de validação
// interface newCycleFormData {
//   task: string
//   minutesAmount: number
// }

// type: melhor para criar uma tipagem a partir de outra referência/variável
// zod.infer: inferir os dados do data com base no newCycleFormValidationSchema
type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date // data que ele ficou ativo
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  // tem que ser uma lista de ciclos pra armazenar o histórico
  const [cycles, setCycles] = useState<Cycle[]>([])

  // enquanto não tiver nada no histórico, sempre será inicializado como null
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // total de segundos que se passaram desde o início de um novo ciclo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  //  useForm: objeto que possui várias funções/variáveis para criar o formulário
  /**
   * register: adiciona input no formulário, tira a necessidade de colocar name no input
   * function register(name, string){
   *  return(
   *    onChange: () => void,
   *    onBlur: () => void,
   *    onFocus: () => void,
   *  )
   * }
   */

  // defaultValues: valor inicial de cada campo
  // Passar o genéric com o newCycleFormData informe as defaultValues as variáveis possíveis (task, minutesAmout)
  // ctrl + espaço indica as variáveis da interface newCycleFormData
  // reset: automaticamente volta os valores para os resultado que coloquei no defaultValues
  const { register, handleSubmit, watch, formState, reset } =
    useForm<newCycleFormData>({
      // Adicionar dentro de zodResolver toda a lógica de validação
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
        task: '',
        minutesAmount: 5,
      },
    })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

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
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          setAmountSecondsPassed(totalSeconds)

          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // retorno do useEffect sempre será uma função
    // nesse caso o useEffect será chamado toda vez que a activeCycle mudar, portanto quando chamar o useEffect de novo, vou fazer o clearInterval
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, totalSeconds])

  function handleCreateNewCycle(data: newCycleFormData) {
    const id = String(new Date().getTime())

    // id com base no milisegundo que a pessoa clicou no botão
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(), // data atual = data que o ciclo iniciou
    }

    // sempre que o valor do estado precisa do valor anterior, é necessário alterar por função
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)

    // zera a quantidade de segundos que se passaram, pra toda vez começar no tempo cheio que o usuário passou
    setAmountSecondsPassed(0)

    reset()
  }

  function handleInterruptCycle() {
    // percorre o objeto e acha o ciclo ativo para mudar a data que foi interrompido
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  // Retorna os erros de validação do resolver
  // console.log(formState.errors)

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  // padStart: nesse caso a string sempre tem que ter tamanho , caso contrário o padStart irá preencher com '0' até chegar no tamanho desejado
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // coloca o timer no title da página também
  useEffect(() => {
    if (activeCycle) {
      document.title = `Ignite Timer - ${minutes}:${seconds}`
    }
  }, [minutes, seconds])

  // console.log(activeCycle)

  // Observa o valor do input em tempo real, transforma form em controlled
  // Controlled recria o componente inteiro ou somente o input nesse caso
  const task = watch('task')
  const isSubmitDisabled = !task

  console.log(cycles)

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="dê um nome para o seu projeto"
            disabled={
              !!activeCycle // se tiver algum valor dentro, '!!' converte pra true, caso constrário, false
            }
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmout"
            placeholder="+ 00 -"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos</span>
        </FormContainer>

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

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
