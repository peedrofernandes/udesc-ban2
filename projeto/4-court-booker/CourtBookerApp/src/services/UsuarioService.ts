import axiosApi from "../infra/Axios";

export type CredentialsDTO = {
  cpf: string
  senha: string
}

export type PostUsuarioDTO = {
  cpf: string
  email: string
  nome: string
  senha: string
  tipoUsuario?: 0 | 1 | 2 // 0 = comum, 1 = adm, 2 = bolsista
  dataFimBolsa?: string
}

export type UsuarioDTO = {
  cpf: string 
  senha: string
  email: string
  dataFimBolsa: string
  tipoUsuario: number
  tipoUsuarioAux: string
  nome: string
}

export default class UsuarioService {
  private static verb = "/Usuario"

  private static async PutUsuario(usuarioDTO: PostUsuarioDTO) {
    await axiosApi.instance.put(this.verb, usuarioDTO)
  }


  static async GetUsuario(cpf: string): Promise<UsuarioDTO> {
    const response = await axiosApi.instance.get<UsuarioDTO>(`${this.verb}/${cpf}`)

    return response.data
  }

  static async Login(credentials: CredentialsDTO) {
    const { cpf, senha } = credentials

    await axiosApi.instance.post<UsuarioDTO>(
      "/Auth/login", 
      null,
      { params: { cpf, senha } }
    )
  }

  static async PostUsuario(usuarioDTO: PostUsuarioDTO) {
    await axiosApi.instance.post<UsuarioDTO>(this.verb, usuarioDTO)
  }


  static async PromoverUsuarioABolsista(cpf: string, dataFimBolsa: string) {
    const usuario = await this.GetUsuario(cpf)

    if (!usuario) throw new Error("Esse usuário não está cadastrado!")

    const updatedUsuario: PostUsuarioDTO = {
      cpf,
      email: usuario.email,
      nome: usuario.nome,
      senha: usuario.senha,
      tipoUsuario: 2,
      dataFimBolsa,
    }

    await this.PutUsuario(updatedUsuario)

    return updatedUsuario
  }
}
