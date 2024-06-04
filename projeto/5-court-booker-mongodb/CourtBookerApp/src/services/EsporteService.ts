import axiosApi from "../infra/Axios"

export type EsporteDTO = {
  id: number
  nome: string
  idQuadras: number[]
}

export default class EsporteService {
  private static verb = "/Esporte"

  static async GetEsportes() {
    const response = await axiosApi.instance.get<EsporteDTO[]>(this.verb)

    return response.data
  }

  static async PostEsporte(nome: string) {
    const response = await axiosApi.instance.post<EsporteDTO>(this.verb, { nome, idQuadras: [] })

    return response.data
  }

  static async DeleteEsporte(id: number) {
    await axiosApi.instance.delete(`${this.verb}/${id}`)
  }
}
