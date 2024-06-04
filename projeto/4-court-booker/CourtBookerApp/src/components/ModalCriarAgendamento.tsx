/*

Fluxo de criação de agendamento

------------------------------
Administrador e bolsista
------------------------------
Seleção do usuário
Seleção do bloco
Seleção da quadra
Seleção do dia

Visualização da disponibilidade

Seleção dos horários (inicial e final)
------------------------------

------------------------------
Usuário comum
------------------------------
Seleção do bloco
Seleção da quadra
Seleção do dia

Verificação de disponibilidade

Seleção dos horários (inicial e final)

*/

import { Box, Button, Checkbox, Chip, CircularProgress, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BlocoDTO } from "../services/BlocoService";
import { QuadraDTO } from "../services/QuadraService";
import AppModal from "./AppModal";
import { TimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import DisponibilidadeQuadra from "./DisponibilidadeQuadra";
import { Dias, PostAgendamentoDTO } from "../services/AgendamentoService";
import FormatTime from "../utils/FormatTime";
import { useAuth, useToast } from "../contexts/hooks";
import UsuarioService from "../services/UsuarioService";

type ModalCriarAgendamentoProps = {
  open: boolean
  handleClose: () => void
  handleSubmit: (dto: PostAgendamentoDTO) => Promise<void>
  blocoOptions: BlocoDTO[]
  quadraOptions: QuadraDTO[]
}

export default function ModalCriarAgendamento(props: ModalCriarAgendamentoProps) {
  const diasSemana = useMemo(() => ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"], [])

  const { auth } = useAuth()
  const { setToast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  const blocos = props.blocoOptions
  const [quadras, setQuadras] = useState<QuadraDTO[]>(props.quadraOptions)

  const [cpfUsuario, setCpfUsuario] = useState<string>("")

  const [selectedBloco, setSelectedBloco] = useState<number | null>(null)
  function handleChangeBloco(e: SelectChangeEvent<number>) {
    const { value } = e.target

    setSelectedBloco(
      typeof value === "string" ? Number(value) : value
    )

    const selectedBloco = props.blocoOptions.find((b) => b.id === value)
    if (selectedBloco) {
      setQuadras(props.quadraOptions.filter((q) => q.idBloco === selectedBloco.id))
    }
  }

  const [isEvento, setIsEvento] = useState<boolean>(false)
  const [isRecorrente, setIsRecorrente] = useState<boolean>(false)
  function toggleIsEvento(value: boolean) {
    setIsEvento(value)
    if (!value && isRecorrente) {
      setIsRecorrente(false)
    }
  }
  function toggleIsRecorrente(value: boolean) {
    setIsRecorrente(value)
    if (value && !isEvento) {
      setIsEvento(true)
    }
  }

  const [selectedQuadra, setSelectedQuadra] = useState<number | null>(null)
  function handleChangeQuadra(e: SelectChangeEvent<number>) {
    const { value } = e.target

    setSelectedQuadra(
      typeof value === "string" ? Number(value) : value
    )
  }

  const [dataInicial, setDataInicial] = useState<string | null>(null)
  const [dataFinal, setDataFinal] = useState<string | null>(null)

  const [selectedDiasSemana, setSelectedDiasSemana] = useState<Dias[]>([])
  function handleChangeDiasSemana(e: SelectChangeEvent<number[]>) {
    const { value } = e.target

    setSelectedDiasSemana(
      typeof value === "string" ? value.split(",").map((val) => Number(val)) : value 
    )
  }

  const [horarioInicial, setHorarioInicial] = useState<Dayjs | null>(null)
  const [horarioFinal, setHorarioFinal] = useState<Dayjs | null>(null)

  const [formError, setFormError] = useState<boolean>(false)

  useEffect(() => {
    if (formError) setFormError(false)
  }, [cpfUsuario, selectedBloco, isEvento, isRecorrente, selectedQuadra, dataInicial, dataFinal, selectedDiasSemana, horarioInicial, horarioFinal, formError])

  async function handleSubmitUsuarioComum() {
    if (!auth) throw new Error("Sem autenticação no handleSubmitUsuarioComum (criar agendamento para usuários comuns)!")

    const isValid = selectedQuadra && dataInicial && horarioInicial && horarioFinal

    if (!isValid) {
      setToast({
        msg: "Preencha todos os campos para criar o agendamento!",
        severity: "error",
      })
      setFormError(true)
      return
    }

    const m0 = horarioInicial.minute()
    const mf = horarioFinal.minute()
    if ((m0 !== 0 && m0 !== 30) || (mf !== 0 && mf !== 30)) {
      setToast({
        msg: "O intervalo de minutos permitido é de 30 em 30 minutos!",
        severity: "error",
      })
      return
    }

    try {
      setLoading(true)
      await props.handleSubmit({
        horarioInicial: FormatTime([horarioInicial.hour(), horarioInicial.minute()]),
        horarioFinal: FormatTime([horarioFinal.hour(), horarioFinal.minute()]),
        dataInicio: dataInicial,
        dataFim: dataInicial,

        cpfUsuario: auth.cpf,
        emailUsuario: auth.email,
        
        idQuadra: selectedQuadra,

        statusAgendamento: 0,
        presenca: false,

        evento: false,
        recorrente: false,
        diasSemana: [],
      })
      setLoading(false)
    } catch (error) {
      setToast({
        msg: `Houve um erro ao buscar o usuário com CPF ${cpfUsuario}!`,
        severity: "error",
      })
    }
  }

  async function handleSubmitAdm() {
    const isValidRequiredProps = cpfUsuario && selectedQuadra && dataInicial && horarioInicial && horarioFinal
    const isValidRequiredRecorenteProps = !isRecorrente || (isRecorrente && dataFinal && (selectedDiasSemana.length > 0))
    const isValid = isValidRequiredProps && isValidRequiredRecorenteProps

    if (!isValid) {
      setToast({
        msg: "Preencha todos os campos para criar o agendamento!",
        severity: "error",
      })
      setFormError(true)
      return
    }

    const m0 = horarioInicial.minute()
    const mf = horarioFinal.minute()
    if ((m0 !== 0 && m0 !== 30) || (mf !== 0 && mf !== 30)) {
      setToast({
        msg: "O intervalo de minutos permitido é de 30 em 30 minutos!",
        severity: "error",
      })
      return
    }

    try {
      const usuario = await UsuarioService.GetUsuario(cpfUsuario)
      
      if (!usuario) {
        setToast({
          msg: `Não existe usuário com o cpf ${cpfUsuario}!`,
          severity: "error",
        })
        return
      }
      
      setLoading(true)
      await props.handleSubmit({
        horarioInicial: FormatTime([horarioInicial.hour(), horarioInicial.minute()]),
        horarioFinal: FormatTime([horarioFinal.hour(), horarioFinal.minute()]),
        dataInicio: dataInicial,
        dataFim: isRecorrente ? (dataFinal as string) : dataInicial,

        cpfUsuario,
        emailUsuario: usuario.email,
        
        idQuadra: selectedQuadra,

        statusAgendamento: 0,
        presenca: false,

        evento: isEvento,
        recorrente: isRecorrente,
        diasSemana: isRecorrente ? selectedDiasSemana : [],
      })
      setLoading(false)
    } catch (error) {
      setToast({
        msg: `Houve um erro ao buscar o usuário com CPF ${cpfUsuario}!`,
        severity: "error",
      })
    }
  }

  return (
    <AppModal open={props.open} onClose={props.handleClose}>

      <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
        Realizar novo agendamento
      </Typography>

      <Stack component="form" noValidate autoComplete="off" alignItems="center">

        <Stack spacing={2} component="div" my={4} style={{ width: "100%" }}>


          {/* CPF do usuário (somente para bolsistas e administradores) */}
          {auth && auth.tipoUsuario !== 0 && (
            <FormControl fullWidth>
              <TextField label="CPF do usuário" value={cpfUsuario} onChange={(e) => setCpfUsuario(e.target.value)} error={formError} />
            </FormControl>
          )}

          {/* Seleção do bloco */}
          <FormControl fullWidth error={formError}>
            <InputLabel id="select-bloco-label">Bloco</InputLabel>
            <Select
              value={selectedBloco ?? ""}
              input={<OutlinedInput id="select-bloco" label="Bloco" />}
              onChange={handleChangeBloco}
            >
              {blocos.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.nome}
                </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Seleção da quadra */}
          <FormControl fullWidth error={formError}>
            <InputLabel id="select-quadra-label">Quadra</InputLabel>
            <Select
              disabled={!selectedBloco}
              value={selectedQuadra ?? ""}
              input={<OutlinedInput id="select-quadra" label="Quadra" />}
              onChange={handleChangeQuadra}
            >
              {quadras.map((q) => (
                <MenuItem key={q.id} value={q.id}>
                  {q.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Evento e recorrência */}
          {(auth && auth.tipoUsuario === 1) && (
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              {/* Evento */}
              <FormControlLabel 
                label="Evento"
                control={<Checkbox checked={isEvento} onChange={(e) => toggleIsEvento(e.target.checked)} />} 
                disabled={!selectedBloco}
              />

              {/* Recorrente */}
              <FormControlLabel 
                label="Recorrente"
                control={<Checkbox checked={isRecorrente} onChange={(e) => toggleIsRecorrente(e.target.checked)}/>} 
                disabled={!selectedBloco} 
              />
            </Box>
          )}

          {/* Datas */}

          {(auth && auth.tipoUsuario === 1) ? (
            <Box sx={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
              {/* Seleção da data inicial */}
              <FormControl fullWidth error={formError} >
                <TextField
                  disabled={!selectedBloco}
                  id="date"
                  label={isRecorrente ? "Data de início do agendamento recorrente" : "Data do agendamento"}
                  type="date"
                  onChange={(e) => setDataInicial(e.target.value)}
                  value={dataInicial ?? ''}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
  
              {/* Seleção da data final (apenas se for recorrente) */}
              <FormControl fullWidth error={formError} >
                <TextField
                  disabled={!selectedBloco || !isRecorrente}
                  id="date"
                  label={"Data final do agendamento recorrente"}
                  type="date"
                  onChange={(e) => setDataFinal(e.target.value)}
                  value={dataFinal ?? ''}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Box>
          ) : (
            <FormControl fullWidth error={formError} >
              <TextField
                disabled={!selectedBloco}
                id="date"
                label={isRecorrente ? "Data de início do agendamento recorrente" : "Data do agendamento"}
                type="date"
                onChange={(e) => setDataInicial(e.target.value)}
                value={dataInicial ?? ''}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          )}


          {/* Seleção de dias de semana (apenas se for recorrente) */}
          {(auth && auth.tipoUsuario === 1) && (
            <FormControl fullWidth error={formError}>
              <InputLabel id="dias-semana-label">Dias da semana de repetição do evento recorrente</InputLabel>
              <Select
                disabled={!isRecorrente}
                multiple
                value={selectedDiasSemana}
                onChange={handleChangeDiasSemana}
                input={<OutlinedInput id="select-dias-semana" label="Dias da semana de repetição do evento recorrente" />}
                renderValue={(selectedDiasSemana) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedDiasSemana.map((d) => <Chip key={d} label={diasSemana[d]} variant="outlined" />)}
                  </Box>
                )}
              >
                {diasSemana.map((d) => (
                  <MenuItem key={diasSemana.indexOf(d)} value={diasSemana.indexOf(d)}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Disponibilidade */}
          <DisponibilidadeQuadra 
            disabled={!(selectedQuadra && dataInicial) || isRecorrente}
            data={(dataInicial && !isRecorrente) ? dataInicial : ""}
            quadra={quadras.find((q) => q.id === selectedQuadra) as QuadraDTO}
          />

          {/* Horários iniciais e finais */}
          <Box sx={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
            <FormControl fullWidth error={formError}>
              <TimePicker
                disabled={!dataInicial}
                label="Escolha o horário inicial"
                ampm={false}
                value={horarioInicial}
                onChange={setHorarioInicial}
                minutesStep={30}
              />
            </FormControl>
            <FormControl fullWidth error={formError}>
              <TimePicker
                disabled={!dataInicial}
                label="Escolha o horário final"
                ampm={false}
                value={horarioFinal}
                onChange={setHorarioFinal}
                minutesStep={30}
              />
            </FormControl>
          </Box>

        </Stack>

        {auth && (
          <Button 
            variant="contained" 
            disabled={loading} 
            onClick={auth.tipoUsuario === 0 ? handleSubmitUsuarioComum : handleSubmitAdm} 
            sx={{ width: "220px" }}
          >
            { loading ? <CircularProgress size={24} /> : "Fazer agendamento" }
          </Button>
        )}

      </Stack>

    </AppModal>
  )
}