import { z } from "zod"
import axiosApi from "../infra/Axios"

const zDate = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, { message: "Formato de data inválido" })
const zTime = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, { message: "Formato de horário inválido!" })
const zodCPF = z.string().length(11, { message: "CPF deve ter 11 dígitos!" })
const zodEmail = z.string().email({ message: "E-mail inválido!" })

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/

const DiasSchema = z.enum(["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"])

const PostAgendamentoDTOSchema = z.object({
  horarioInicial: zTime,
  horarioFinal: zTime,
  dataInicio: zDate,
  dataFim: zDate,
  cpfUsuario: zCPF,
  emailUsuario: zodEmail,
  idQuadra: z.number(),
  statusAgendamento: z.number(),
  presenca: z.boolean(),
  evento: z.boolean(),
  recorrente: z.boolean(),
  diasSemana: z.array(DiasSchema),
})

// export enum Dias {
//   Domingo = 0,
//   Segunda = 1,
//   Terca = 2,
//   Quarta = 3,
//   Quinta = 4,
//   Sexta = 5,
//   Sabado = 6,
// }

// export type PostAgendamentoDTO = {
//   horarioInicial: string
//   horarioFinal: string
//   dataInicio: string
//   dataFim: string

//   cpfUsuario: string
//   emailUsuario: string

//   idQuadra: number

//   statusAgendamento: number
//   presenca: boolean
//   evento: boolean
//   recorrente: boolean
//   diasSemana: Dias[]
// }



const AgendamentoDTOSchema = z.object({
  id: z.number(),
  horarioInicial: z.string().regex(timeRegex, { message: "Formato de horário inválido!" }),
  horarioFinal: z.string().regex(timeRegex, { message: "Formato de horário inválido!" }),
  dataInicio: z.date(),
  dataFim: z.date(),
  cpfUsuario: z.string().length(11, { message: "CPF deve ter 11 dígitos!" }),
  idQuadra: z.number(),
  statusAgendamento: z.number(),
  statusAgendamentoAux: z.string(),
  presenca: z.boolean(),
  evento: z.boolean(),
  recorrente: z.boolean(),
  diasSemana: z.array(z.number()),
})

export type AgendamentoDTO = z.infer<typeof AgendamentoDTOSchema>

// export type AgendamentoDTO = {
//   id: number
//   horarioInicial: string
//   horarioFinal: string
//   dataInicio: string
//   dataFim: string
//   cpfUsuario: string
//   idQuadra: number
//   statusAgendamento: number
//   statusAgendamentoAux: string
//   emailUsuario: string
//   presenca: boolean
//   evento: boolean
//   recorrente: boolean
//   diasSemana: number[]
// }

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

  static async GetAgendamentos(): Promise<AgendamentoDTO[]> {
    const response = await axiosApi.instance.get<AgendamentoDTO[]>(this.verb)

    return response.data.map((item) => AgendamentoDTOSchema.parse(item))
  }

  static async GetAgendamentosDoBloco(idBloco: number): Promise<AgendamentoDTO[]> {
    const response = await axiosApi.instance.get<AgendamentoDTO[]>(`${this.verb}/AgendamentosDoBloco/${idBloco}`)

    return response.data.map((item) => AgendamentoDTOSchema.parse(item))
  }

  static async PostAgendamento(payload: PostAgendamentoDTO) {
    const response = await axiosApi.instance.post<AgendamentoDTO>(this.verb, payload)

    return response.data
  }

  static async DeleteAgendamento(id: number) {
    await axiosApi.instance.delete(`${this.verb}/${id}`)
  }

}