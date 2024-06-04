import { z } from "zod"
import axiosApi from "../infra/Axios"

export enum Dias {
  Domingo = 0,
  Segunda = 1,
  Terca = 2,
  Quarta = 3,
  Quinta = 4,
  Sexta = 5,
  Sabado = 6,
}

export type PostAgendamentoDTO = {
  horarioInicial: string
  horarioFinal: string
  dataInicio: string
  dataFim: string

  cpfUsuario: string
  emailUsuario: string

  idQuadra: number

  statusAgendamento: number
  presenca: boolean
  evento: boolean
  recorrente: boolean
  diasSemana: Dias[]
}

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/

const AgendamentoDTOSchema = z.object({
  id: z.number(),
  horarioInicial: z.string().regex(timeRegex, { message: "Formato de horário inválido!" }),
  horarioFinal: z.string().regex(timeRegex, { message: "Formato de horário inválido!" }),
  dataInicio: z.date(),
  dataFim: z.date(),
  cpfUsuario: z.string().length(11, { message: "CPF deve ter 11 dígitos!" }),
  idQuadra: z.number(),
  statusAgendamento: z.number(),
  statusAgendamentoAux
})

export type AgendamentoDTO = {
  id: number
  horarioInicial: string
  horarioFinal: string
  dataInicio: string
  dataFim: string
  cpfUsuario: string
  idQuadra: number
  statusAgendamento: number
  statusAgendamentoAux: string
  emailUsuario: string
  presenca: boolean
  evento: boolean
  recorrente: boolean
  diasSemana: number[]
}

// {
//   "id": 1150839359,
//   "horarioInicial": "08:00:00",
//   "horarioFinal": "10:00:00",
//   "dataInicio": "2023-12-30T00:00:00",
//   "dataFim": "2023-12-30T00:00:00",
//   "cpfUsuario": "32132132132",
//   "idQuadra": 1637626026,
//   "statusAgendamento": 0,
//   "statusAgendamentoAux": "reservado",
//   "emailUsuario": "gm.pedro.fernandes@gmail.com",
//   "presenca": false,
//   "evento": false,
//   "recorrente": false,
//   "diasSemana": []
// }
// {
//   "id": 1,
//   "horarioInicial": "08:30:00",
//   "horarioFinal": "10:00:00",
//   "dataInicio": "2023-11-07T00:00:00",
//   "dataFim": "2023-11-07T00:00:00",
//   "cpfUsuario": "12312312312",
//   "idQUadra": 1,
//   "statusAgendamento": 0,
//   "statusAgendamentoAux": "reservado",
//   "emailUsuario": "P@P.COM",
//   "presenca": false,
//   "evento": false,
//   "recorrente": false,
//   "diasSemana": null
// },

export default class AgendamentoService {
  private static verb = "/Agendamento"

  static async GetAgendamentos() {

    const response = await axiosApi.instance.get<AgendamentoDTO[]>(this.verb)

    return response.data
  }

  static async GetAgendamentosDoBloco(idBloco: number) {
    const response = await axiosApi.instance.get<AgendamentoDTO[]>(`${this.verb}/AgendamentosDoBloco/${idBloco}`)

    return response.data
  }

  static async PostAgendamento(payload: PostAgendamentoDTO) {
    const response = await axiosApi.instance.post<AgendamentoDTO>(this.verb, payload)

    return response.data
  }

  static async DeleteAgendamento(id: number) {
    await axiosApi.instance.delete(`${this.verb}/${id}`)
  }

}