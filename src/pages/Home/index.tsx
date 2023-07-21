import { useContext } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // Não possui export default, por isso * as zod, caso contrário teria que colocar entre {} cada coisa que queríamos importar

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../contexts/CyclesContext'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
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

export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycle } =
    useContext(CyclesContext)

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

  const { handleSubmit, watch /*, reset */ } = newCycleForm

  // Retorna os erros de validação do resolver
  // console.log(formState.errors)

  // console.log(activeCycle)

  // Observa o valor do input em tempo real, transforma form em controlled
  // Controlled recria o componente inteiro ou somente o input nesse caso
  const task = watch('task')

  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)} action="">
        <FormProvider
          {
            ...newCycleForm // pego cada propriedade do newCycleForm e passo como propriedade
          }
        >
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
