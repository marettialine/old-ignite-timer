import { useContext } from 'react'
import {
  differenceInMinutes,
  formatDistance,
  formatDistanceToNow,
} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { CyclesContext } from '../../contexts/CyclesContext'

import { HistoryContainer, HistoryList, Status } from './styles'

export function History() {
  const { cycles } = useContext(CyclesContext)

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      {/* Listagem do JSON <pre>{JSON.stringify(cycles, null, 2)}</pre> */}

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Tempo Transcorrido</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => {
              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.minutesAmount} minutos</td>
                  <td>
                    {differenceInMinutes(new Date(), cycle.startDate) < 1
                      ? 'há 0 minutos'
                      : formatDistanceToNow(cycle.startDate, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                  </td>
                  <td>
                    {
                      // estrutura de if que tem apenas o then e não tem else abaixo
                      cycle.finishedDate && (
                        <span>
                          {differenceInMinutes(
                            cycle.finishedDate,
                            cycle.startDate,
                          ) < 1
                            ? '0 minutos'
                            : formatDistance(
                                cycle.finishedDate,
                                cycle.startDate,
                                {
                                  addSuffix: false,
                                  locale: ptBR,
                                },
                              )}
                        </span>
                      )
                    }
                    {
                      // estrutura de if que tem apenas o then e não tem else abaixo
                      cycle.interruptedDate && (
                        <span>
                          {differenceInMinutes(
                            cycle.interruptedDate,
                            cycle.startDate,
                          ) < 1
                            ? '0 minutos'
                            : formatDistance(
                                cycle.interruptedDate,
                                cycle.startDate,
                                {
                                  addSuffix: false,
                                  locale: ptBR,
                                },
                              )}
                        </span>
                      )
                    }
                    {
                      // estrutura de if que tem apenas o then e não tem else abaixo
                      !cycle.finishedDate && !cycle.interruptedDate && (
                        <span>-</span>
                      )
                    }
                  </td>
                  <td>
                    {
                      // estrutura de if que tem apenas o then e não tem else abaixo
                      cycle.finishedDate && (
                        <Status statusColor="green">Concluído</Status>
                      )
                    }
                    {
                      // estrutura de if que tem apenas o then e não tem else abaixo
                      cycle.interruptedDate && (
                        <Status statusColor="red">Interrompido</Status>
                      )
                    }
                    {
                      // estrutura de if que tem apenas o then e não tem else abaixo
                      !cycle.finishedDate && !cycle.interruptedDate && (
                        <Status statusColor="yellow">Em andamento</Status>
                      )
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
