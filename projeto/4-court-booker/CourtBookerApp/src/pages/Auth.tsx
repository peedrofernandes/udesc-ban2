import styled from "styled-components"
import { Grid } from "../components/Grid"
import { GridItem } from "../components/GridItem"
import { Button, CircularProgress, Stack, TextField } from "@mui/material"
import { useState } from "react"
import UsuarioService from "../services/UsuarioService"
import { useAuth, useToast } from "../contexts/hooks"

const LoginContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const FormContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`

const SwapAnchor = styled.a`
  cursor: pointer;
  color: #7fc1f7;
  
  &:hover {
    text-decoration: underline;
    color: #359ef5;
  }

  transition: 0.1s ease-in-out;
`

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

enum AuthState {
  login = 0,
  createAccount = 1,
}

export default function Auth() {
  const { setAuth } = useAuth()
  const { setToast } = useToast()

  const [authState, setAuthState] = useState<AuthState>(AuthState.login)

  const [cpf, setCpf] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [nome, setNome] = useState<string>("")
  const [senha, setSenha] = useState<string>("")
  const [confirmarSenha, setConfirmarSenha] = useState<string>("")

  const [loading, setLoading] = useState<boolean>(false)

  function handleAuthStateChange() {
    const newAuthState = authState === AuthState.login
      ? AuthState.createAccount
      : AuthState.login

    setCpf("")
    setEmail("")
    setNome("")
    setConfirmarSenha("")
    setSenha("")
    setAuthState(newAuthState)
  }

  async function handleSubmit() {
    setLoading(true)

    if (authState === AuthState.login) {

      // login
      try {
        await UsuarioService.Login({ cpf, senha })

        const usuario = await UsuarioService.GetUsuario(cpf)

        setToast({
          msg: "Login efetuado com sucesso!",
          severity: "success",
        })
        setAuth(usuario)
      } catch (error) {
        setToast({
          msg: "Erro ao tentar fazer login!",
          severity: "error",
        })
      }

    } else {
      // criar usuário novo
      try {

        if (senha !== confirmarSenha) {
          setToast({
            msg: "As senhas não coincidem!",
            severity: "error",
          })
          setLoading(false)
          return
        }

        await UsuarioService.PostUsuario({ cpf, email, nome, senha })
        const usuario = await UsuarioService.GetUsuario(cpf)
        setAuth(usuario)
        setToast({
          msg: "Usuário criado com sucesso!",
          severity: "success",
        })
      } catch (error) {
        setToast({
          msg: "Erro ao criar uma nova conta!",
          severity: "error",
        })
      }
      
    }

    setLoading(false)
  }



  return (
    <LoginContainer>

      <FormContainer>
        <Grid>

          <GridItem rAbs={{ xs: [1, 5], sm: [2, 8], md: [2, 12] }}>
            <Stack sx={{ textAlign: "center" }}>
            <h3>
              {
                authState === AuthState.login
                  ? "Bem-vindo ao CourtBooker! Realize o login abaixo."
                  : "Crie uma nova conta no CourtBooker agora mesmo!"
              }
            </h3>
            <span>
              <SwapAnchor onClick={handleAuthStateChange}>
                {
                  authState === AuthState.login 
                    ? "Ou clique aqui para criar uma nova conta" 
                    : "Já tem uma conta? Clique aqui para fazer login"
                }
              </SwapAnchor>
            </span>
            </Stack>
          </GridItem>

          <GridItem rAbs={{ xs: [1, 5], sm: [2, 8], md: [2, 12] }}>
            <Stack spacing={2} component="form" noValidate autoComplete="off" mt={4}>

              <TextField fullWidth label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)}/>

              {
                authState === AuthState.createAccount && (
                  <>
                    <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField fullWidth label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                  </>
                )
              }

              <TextField fullWidth type="password" label="Senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>
              
              {
                authState === AuthState.createAccount && (
                  <TextField fullWidth type="password" label="Confirmar senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
                )
              }

              <center>
              <Button variant="contained" disabled={loading} onClick={handleSubmit} sx={{ width: "180px" }}>
                {
                  loading 
                    ? <CircularProgress size={24}/> 
                    : authState === AuthState.login
                    ? "Login"
                    : "Criar conta"
                }
              </Button>
              </center>
            </Stack>
          </GridItem>

        </Grid>
      </FormContainer>

    </LoginContainer>
  )
}
