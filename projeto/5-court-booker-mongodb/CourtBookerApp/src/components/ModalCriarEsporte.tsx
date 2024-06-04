import { Button, CircularProgress, FormControl, Stack, TextField, Typography } from "@mui/material"
import AppModal from "./AppModal"
import { useState } from "react"
import { useToast } from "../contexts/hooks"

type ModalCriarEsporteProps = {
  open: boolean
  handleClose: () => void
  handleSubmit: (nomeEsporte: string) => Promise<void>
}

export default function ModalCriarEsporte(props: ModalCriarEsporteProps) {
  const { setToast } = useToast()

  const [nomeEsporte, setNomeEsporte] = useState<string>("")

  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<boolean>(false)

  async function handleSubmit() {
    if (!nomeEsporte) {
      setFormError(true)
      setToast({
        msg: "Dê um nome para o esporte!",
        severity: "error",
      })
      return
    }

    setLoading(true)
    await props.handleSubmit(nomeEsporte)
    setLoading(false)
  }

  return (
    <AppModal open={props.open} onClose={props.handleClose}>
      <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
        Criar novo esporte
      </Typography>

      <Stack component="form" noValidate autoComplete="off" alignItems="center">

      <Stack spacing={2} component="div" my={4} style={{ width: "100%" }}>

        {/* Nome do esporte */}
        <FormControl fullWidth>
          <TextField label="Nome do esporte" error={formError} value={nomeEsporte} onChange={(e) => setNomeEsporte(e.target.value)}/>
        </FormControl>

      </Stack>

      <Button variant="contained" disabled={loading} onClick={handleSubmit} sx={{ width: "180px" }} >
        { loading ? <CircularProgress size={24} /> : "Criar" }
      </Button>

    </Stack>

    </AppModal>
  )
}