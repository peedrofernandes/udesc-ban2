import { z } from "zod"
import axiosApi from "../infra/Axios"

// const zDate = (message: string = "Formato de data inválido!") => z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, { message })
const zTime = (message: string = "Formato de horário inválido!") => z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, { message })
const zCPF = z.string().length(11, { message: "CPF deve ter 11 dígitos!" })
const zEmail = z.string().email({ message: "E-mail inválido!" })

// const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/

const DiasSchema = z.enum(["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"])

export type Dias = z.infer<typeof DiasSchema>

const PostAgendamentoDTOSchema = z.object({
  horarioInicial: zTime("O formato do horário inicial é inválido!"),
  horarioFinal: zTime("O formato do horário final é inválido!"),
  dataInicio: z.string(),
  dataFim: z.string(),
  cpfUsuario: zCPF,
  emailUsuario: zEmail,
  idQuadra: z.number(),
  statusAgendamento: z.number(),
  presenca: z.boolean(),
  evento: z.boolean(),
  recorrente: z.boolean(),
  diasSemana: z.array(DiasSchema),
})

export type PostAgendamentoDTO = z.infer<typeof PostAgendamentoDTOSchema> 

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
  horarioInicial: zTime(),
  horarioFinal: zTime(),
  dataInicio: z.string(),
  dataFim: z.string(),
  cpfUsuario: zCPF,
  idQuadra: z.number(),
  statusAgendamento: z.number(),
  statusAgendamentoAux: z.string(),
  presenca: z.boolean(),
  evento: z.boolean(),
  recorrente: z.boolean(),
  diasSemana: z.array(z.number()),
})

export type AgendamentoDTO = z.infer<typeof AgendamentoDTOSchema>

const AgendamentoResponsePayloadSchema = z.union([AgendamentoDTOSchema, z.array(AgendamentoDTOSchema)])

type AgendamentoResponsePayload = z.infer<typeof AgendamentoResponsePayloadSchema>

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

  static async PostAgendamento(payload: PostAgendamentoDTO): AgendamentoDTO[] {
    const response = await axiosApi.instance.post<AgendamentoResponsePayload>(this.verb, payload)

    console.log("POST AGENDAMENTO!")
    console.log(response.data)

    const parsedResult = AgendamentoResponsePayloadSchema.parse(response.data)

    return Array.isArray(parsedResult)
      ? parsedResult
      ? [parsedResult]
  }

  static async DeleteAgendamento(id: number) {
    await axiosApi.instance.delete(`${this.verb}/${id}`)
  }

}