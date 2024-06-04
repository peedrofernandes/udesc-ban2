import { BrowserRouter as Router } from 'react-router-dom'
import styled from 'styled-components'
import { Grid } from '../components/Grid'
import { GridItem } from '../components/GridItem'
import AppRoutes from './routes'
import { Alert, AlertTitle, Button, Snackbar, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth, useModal, useToast } from '../contexts/hooks'
import FormatDate from '../utils/FormatDate'
import { Modals } from '../contexts/modal'

const AppHeader = styled.header`
  text-align: center;
  margin: 16px 0;
`

export default function AppRouter() {
  const { auth, setAuth } = useAuth()
  const { toast, setToast } = useToast()
  const { setModal } = useModal()

  function logout() {
    localStorage.removeItem("auth")
    setAuth(null)
  }

  return (
    <Router>

    <Grid>
      <GridItem span={12}>

        {auth && (
          <div style={{ position: "absolute", top: "16px", left: "16px" }}>
            <Button variant="outlined" onClick={logout}>
              Sair
            </Button>
          </div>
        )}

        {(auth && auth.tipoUsuario === 1) && (
          <div style={{ position: "absolute", top: "16px", right: "16px" }}>
            <AccountCircleIcon sx={{ cursor: "pointer" }} onClick={() => setModal(Modals.CriarBolsista)}/>
          </div>
        )}

        <AppHeader>
          {auth && (
            <>
            <Typography variant="body1">
              Bem-vindo(a), {auth.nome}
            </Typography>
            <Typography variant="caption">
              (Permissão: {auth.tipoUsuarioAux}
              {auth.tipoUsuario === 2 && ` até ${FormatDate(auth.dataFimBolsa)}`}
              )
            </Typography>
            </>
          )}
          <h1>CourtBooker</h1>
        </AppHeader>
      </GridItem>
    </Grid>

    <AppRoutes />

      {toast && (

          <Snackbar 
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
            open={toast !== null} 
            autoHideDuration={6000} 
            onClose={() => setToast(null)}
          >

          <Alert elevation={6} variant="filled" onClose={() => setToast(null)} severity={toast?.severity} sx={{ width: '100%'  }}>
            <AlertTitle>
              {toast.severity === "success"
                ? "Sucesso"
                : toast.severity === "warning"
                ? "Aviso"
                : toast.severity === "error"
                && "Erro"}
            </AlertTitle>
            {toast?.msg}
          </Alert>

        </Snackbar>
    )}

    </Router>
  )
}
