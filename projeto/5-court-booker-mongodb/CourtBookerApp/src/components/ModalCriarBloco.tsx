import { Button, CircularProgress, FormControl, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AppModal from "./AppModal";
import { useToast } from "../contexts/hooks";

type ModalCriarBlocoProps = {
  open: boolean
  handleClose: () => void
  handleSubmit: (nomeBloco: string) => Promise<void>
}
export default function ModalCriarBloco(props: ModalCriarBlocoProps) {
  const { setToast } = useToast()
  
  const [nome, setNome] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const [formError, setFormError] = useState<boolean>(false)

  useEffect(() => {
    setFormError(false)
  }, [nome])

  async function handleSubmit() {
    if (!nome) {
      setFormError(true)
      setToast({
        msg: "Preencha todos os dados para criar um novo bloco!",
        severity: "error",
      })
    }

    setLoading(true)
    await props.handleSubmit(nome)
    setLoading(false)
  }

  return (
    <AppModal open={props.open} onClose={props.handleClose}>
      <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
        Criar novo bloco
      </Typography>

      <Stack component="form" noValidate autoComplete="off" alignItems="center">
      
        <Stack spacing={2} component="div" my={4} style={{ width: "100%" }}>

          <FormControl fullWidth>
            <TextField label="Nome do bloco" error={formError} value={nome} onChange={(e) => setNome(e.target.value)}/>
          </FormControl>

        </Stack>

        <Button variant="contained" disabled={loading} onClick={handleSubmit} sx={{ width: "180px" }} >
          { loading ? <CircularProgress size={24} /> : "Criar" }
        </Button>

      </Stack>
    </AppModal>
  )
}