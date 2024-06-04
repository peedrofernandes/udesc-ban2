import { Box, Button, Chip, CircularProgress, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { EsporteDTO } from "../services/EsporteService";
import { BlocoDTO } from "../services/BlocoService";
import AppModal from "./AppModal";
import { useToast } from "../contexts/hooks";

type ModalCriarQuadraProps = {
  open: boolean
  handleClose: () => void
  handleSubmit: (nomeQuadra: string, idBloco: number, idTiposEsporte: number[]) => Promise<void>
  esportes: EsporteDTO[]
  blocos: BlocoDTO[]
}
export default function ModalCriarQuadra(props: ModalCriarQuadraProps) {

  const [loading, setLoading] = useState<boolean>(false)
  const { setToast } = useToast()

  const [nomeQuadra, setNomeQuadra] = useState<string>("")

  const [selectedBloco, setSelectedBloco] = useState<number | undefined>()
  function handleChangeBloco(e: SelectChangeEvent<number>) {
    const { value } = e.target

    setSelectedBloco(
      typeof value === "string" ? Number(value) : value
    )
  }

  const [selectedEsportes, setSelectedEsportes] = useState<number[]>([])
  function handleChangeEsportes(e: SelectChangeEvent<number[]>) {
    const { value } = e.target

    setSelectedEsportes(
      typeof value === "string" ? value.split(",").map((val) => Number(val)) : value 
    )
  }

  const [formError, setFormError] = useState<boolean>(false)
  useEffect(() => {
    setFormError(false)
  }, [nomeQuadra, selectedBloco, selectedEsportes])

  async function handleSubmit() {
    if (!selectedBloco || !nomeQuadra || selectedEsportes.length === 0) {
      setFormError(true)
      setToast({
        msg: "Preencha todos os dados para criar uma quadra!",
        severity: "error",
      })
      return
    }

    setLoading(true)
    await props.handleSubmit(nomeQuadra, selectedBloco, selectedEsportes)
    setLoading(false)
  }

  return (
    <AppModal open={props.open} onClose={props.handleClose}>

        <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
          Criar nova quadra
        </Typography>

        <Stack component="form" noValidate autoComplete="off" alignItems="center">

          <Stack spacing={2} component="div" my={4} style={{ width: "100%" }}>
            {/* Input do nome da quadra */}
            <FormControl fullWidth>
              <TextField error={formError} label="Nome da quadra" value={nomeQuadra} onChange={(e) => setNomeQuadra(e.target.value)} />
            </FormControl>

            {/* Seleção dos tipos de esportes da quadra */}
            <FormControl fullWidth error={formError}>
              <InputLabel id="select-esportes-label">Esportes</InputLabel>
              <Select
                multiple
                value={selectedEsportes}
                onChange={handleChangeEsportes}
                input={<OutlinedInput id="select-esportes" label="Esportes" />}
                renderValue={(selectedEsportes) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedEsportes.map((id) => {
                      const selectedEsporte = props.esportes.find((e) => e.id === id)
                      return <Chip key={id} label={selectedEsporte ? selectedEsporte.nome : "Desconhecido"} variant="outlined"/>
                    })}
                  </Box>
                )}
              >
                {props.esportes.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Seleção do bloco da quadra */}
            <FormControl fullWidth error={formError}>
              <InputLabel id="select-bloco-label">Bloco</InputLabel>
              <Select
                value={selectedBloco}
                input={<OutlinedInput id="select-bloco" label="Bloco" />}
                onChange={handleChangeBloco}
              >
                {props.blocos.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Button variant="contained" disabled={loading} onClick={handleSubmit} sx={{ width: "180px" }} >
            { loading ? <CircularProgress size={24} /> : "Criar quadra" }
          </Button>

        </Stack>

          


      </AppModal>
  )
}