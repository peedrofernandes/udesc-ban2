import { createContext } from "react";
import { UsuarioDTO } from "../../services/UsuarioService";

type AuthContextState = {
  auth: UsuarioDTO | null
  setAuth: React.Dispatch<React.SetStateAction<UsuarioDTO | null>>
}

const AuthContext = createContext<AuthContextState>({
  auth: null,
  setAuth: () => null,
})

export default AuthContext
