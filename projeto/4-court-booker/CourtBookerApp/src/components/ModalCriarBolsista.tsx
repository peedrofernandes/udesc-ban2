import { Button, CircularProgress, FormControl, Stack, TextField, Typography } from "@mui/material"
import AppModal from "./AppModal"
import { useEffect, useState } from "react"
import { useToast } from "../contexts/hooks"

type ModalCriarBolsistaProps = {
  open: boolean
  handleSubmit: (cpf: string, data: string) => Promise<void>
  handleClose: () => void
}

export default function ModalCriarBolsista(props: ModalCriarBolsistaProps) {
  const { setToast } = useToast()

  const [cpfBolsista, setCpfBolsista] = useState<string>("")
  const [dataFimBolsa, setDataFimBolsa] = useState<string | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<boolean>(false)

  useEffect(() => {
    if (formError) setFormError(false)
  }, [cpfBolsista, dataFimBolsa])

  async function handleSubmit() {
    if (!cpfBolsista || !dataFimBolsa) {
      setToast({
        msg: "Preencha todos os campos para promover o usuário a bolsista!",
        severity: "error",
      })
      setFormError(true)
      return
    }

    setLoading(true)
    await props.handleSubmit(cpfBolsista, dataFimBolsa)
    setLoading(false)
  }

  return (
    <AppModal open={props.open} onClose={props.handleClose}>

      <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
        Promover usuário a bolsista
      </Typography>

      <Stack component="form" noValidate autoComplete="off" alignItems="center">

        <Stack spacing={2} component="div" my={4} style={{ width: "100%" }}>

          {/* CPF do bolsista */}
          <FormControl fullWidth>
            <TextField label="CPF do bolsista" value={cpfBolsista} onChange={(e) => setCpfBolsista(e.target.value)} error={formError} />
          </FormControl>

          {/* Data do fim da bolsa */}
          <FormControl fullWidth  >
            <TextField
              error={formError}
              id="data-fim-bolsa"
              label="Data do fim da bolsa"
              type="date"
              onChange={(e) => setDataFimBolsa(e.target.value)}
              value={dataFimBolsa ?? ''}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

        </Stack>

        <Button variant="contained" disabled={loading} onClick={handleSubmit} sx={{ width: "220px" }} >
          { loading ? <CircularProgress size={24} /> : "Provomer usuário a bolsista" }
        </Button>

      </Stack>

    </AppModal>
  )
}