import axiosApi from "../infra/Axios"

export type QuadraDTO = {
  id: number
  nome: string
  idBloco: number
  idTiposEsporte?: number[]
}



export default class QuadraService {
  private static verb = "/Quadra"

  static async GetQuadras() {
    const response = await axiosApi.instance.get<QuadraDTO[]>(this.verb)

    return response.data
  }

  static async PostQuadra(data: Omit<QuadraDTO, "id">) {
    const response = await axiosApi.instance.post<QuadraDTO>(this.verb, data)

    return response.data
  }
}