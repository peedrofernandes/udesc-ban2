import { useEffect, useState } from "react"
import { QuadraDTO } from "../services/QuadraService"
import AgendamentoService, { AgendamentoDTO } from "../services/AgendamentoService"
import styled from "styled-components"
import { Tooltip, Typography } from "@mui/material"
import FormatDate from "../utils/FormatDate"

type AvaliabilityProps = {
  disabled?: boolean
}
const AvailabilityContainer = styled.div<AvaliabilityProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  opacity: ${props => props.disabled ? "25%" : "100%"};
  height: 80px;
  padding-bottom: 16px;
`

const BarContainer = styled.div`
  position: relative;
  width: 100%;
`

const AvaliabilityBar = styled.div`
  position: absolute;
  width: 100%;
  height: 6px;
  top: 14px;
  background-color: #48C774; 
  border-radius: 8px;
  margin: 18px 0;
`

type FloatingBarProps = {
  color: string
  size: number
  offset: number
}
const FloatingBar = styled.div<FloatingBarProps>`
  position: absolute;
  width: ${props => `${(props.size / 48) * 100}%`};
  left: ${props => `${(props.offset / 48) * 100}%`};
  height: 6px;
  top: 14px;
  background-color: ${props => props.color}; 
  border-radius: 8px;
  margin: 18px 0;

  cursor: pointer;

  &:hover {
    transform: scaleY(2);
  }
`

const TimesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
`

type DisponibilidadeQuadraProps = {
  disabled: boolean
  quadra?: QuadraDTO
  data?: string
}

const colors = {
  inactive: "#9E9E9E",
  available: "#48C774",
  unavailable: "#EF5350",
  unavailableEvent: "#FFA726",
}

export default function DisponibilidadeQuadra(props: DisponibilidadeQuadraProps) {
  function isSameDay(d1: Date | string, d2: Date | string) {
    return FormatDate(d1) === FormatDate(d2)
  }

  function getTime(time: string): [number, number] {
    const [hours, minutes] = time.split(":")

    return [Number(hours), Number(minutes)]
  }

  function getBarParams(horarioInicial: [number, number], horarioFinal: [number, number]) {
    const [h0, m0] = horarioInicial
    const [hf, mf] = horarioFinal

    const isValidHours = (h0 >= 0 && h0 <= 23) && (hf >= 0 && hf <= 23)
    const isValidMinutes = (m0 === 0 || m0 === 30) && (mf === 0 || mf === 30)

    if (!isValidHours || !isValidMinutes) {
      throw new Error("Horário errado! Apenas é permitido horário de 30 em 30 minutos.")
    }

    const initialOffset = h0 * 2 + (m0 === 30 ? 1 : 0) 
    const finalOffset = hf * 2 + (mf === 30 ? 1 : 0)

    const size = finalOffset - initialOffset
    
    return {
      size,
      offset: initialOffset,
    }
  }

  const [agendamentos, setAgendamentos] = useState<AgendamentoDTO[]>([])
  useEffect(() => {
    if (!props.quadra || !props.data) return

    AgendamentoService.GetAgendamentosDoBloco(props.quadra.idBloco).then((agendamentosBloco) => {
      const agendamentosQuadra = agendamentosBloco.filter((a) => a.idQUadra === (props.quadra as QuadraDTO).id)
      const agendamentosQuadraDia = agendamentosQuadra.filter((a) => isSameDay(a.dataInicio, (props.data as string)))

      setAgendamentos(agendamentosQuadraDia)
    })
  }, [props.quadra, props.data])



  return (
    <AvailabilityContainer disabled={props.disabled}>

      <Typography>
        {(props.data && props.quadra) ? `Disponibilidade na quadra "${props.quadra.nome}" em ${FormatDate(props.data)}` : `Disponibilidade`}
      </Typography>

      <BarContainer>

        <AvaliabilityBar />
        {!props.disabled && (
          <>
            {/* Estabelecimento fechado */}
            <Tooltip title="Estabelecimento fechado das 00:00 às 06:00!">
              <FloatingBar color={colors.inactive} {...getBarParams([0, 0], [6, 0])} />
            </Tooltip>

            {/* Agendamentos */}
            {agendamentos.map((a) => (
              <Tooltip 
                title={`${a.evento ? "Evento" : "Agendamento"} marcado das ${a.horarioInicial} às ${a.horarioFinal}`}>
                <FloatingBar 
                  color={a.evento ? colors.unavailableEvent : colors.unavailable} 
                  {...getBarParams(getTime(a.horarioInicial), getTime(a.horarioFinal))}
                />
              </Tooltip>
            ))}
          </>
        )}
      </BarContainer>

      <TimesContainer>
        <span>00:00</span>
        <span>23:59</span>
      </TimesContainer>

    </AvailabilityContainer>
  )
}
