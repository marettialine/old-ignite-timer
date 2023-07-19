import { ChangeEvent, createContext, useEffect, useState } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // Não possui export default, por isso * as zod, caso contrário teria que colocar entre {} cada coisa que queríamos importar

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date // data que ele ficou ativo
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

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
  const newCycleForm = useForm<newCycleFormData>({
    // Adicionar dentro de zodResolver toda a lógica de validação
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

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

  // console.log(activeCycle)

  // Observa o valor do input em tempo real, transforma form em controlled
  // Controlled recria o componente inteiro ou somente o input nesse caso
  const task = watch('task')

  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            amountSecondsPassed,
            markCurrentCycleAsFinished,
            setSecondsPassed,
          }}
        >
          <FormProvider
            {
              ...newCycleForm // pego cada propriedade do newCycleForm e passo como propriedade
            }
          >
            <NewCycleForm />
          </FormProvider>

          <Countdown />
        </CyclesContext.Provider>

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
