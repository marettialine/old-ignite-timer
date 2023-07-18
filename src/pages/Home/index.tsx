import { ChangeEvent, useState } from 'react'
import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // Não possui export default, por isso * as zod, caso contrário teria que colocar entre {} cada coisa que queríamos importar

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
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
}

export function Home() {
  // tem que ser uma lista de ciclos pra armazenar o histórico
  const [cycles, setCycle] = useState<Cycle[]>([])

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

  function handleCreateNewCycle(data: newCycleFormData) {
    // id com base no milisegundo que a pessoa clicou no botão
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    // sempre que o valor do estado precisa do valor anterior, é necessário alterar por função
    setCycle((state) => [...state, newCycle])

    reset()
  }

  // Retorna os erros de validação do resolver
  console.log(formState.errors)

  // Observa o valor do input em tempo real, transforma form em controlled
  // Controlled recria o componente inteiro ou somente o input nesse caso
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="dê um nome para o seu projeto"
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
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
