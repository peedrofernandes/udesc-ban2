import axiosApi from "../infra/Axios"

export type BlocoDTO = {
  id: number
  nome: string
}

export default class BlocoService {
  private static verb = "/Bloco"

  static async GetBlocos() {
    const response = await axiosApi.instance.get<BlocoDTO[]>(this.verb)

    return response.data
  }

  static async PostBloco(nomeBloco: string) {
    const response = await axiosApi.instance.post<BlocoDTO>(this.verb, { nome: nomeBloco })

    return response.data
  }
}