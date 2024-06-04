import { useState } from "react"
import { UsuarioDTO } from "../../services/UsuarioService"
import AuthContext from "."

type AuthProviderProps = {
  children: React.ReactNode
}

export default function AuthProvider(props: AuthProviderProps) {
  const [auth, setAuth] = useState<UsuarioDTO | null>(null)

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  )
}
