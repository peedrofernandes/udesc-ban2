import { Card, CardActionArea, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { QuadraDTO } from "../services/QuadraService";
import { BlocoDTO } from "../services/BlocoService";
import { AgendamentoDTO } from "../services/AgendamentoService";
import { ReactNode } from "react";
import styled from "styled-components";
import { EsporteDTO } from "../services/EsporteService";
import FormatDate from "../utils/FormatDate";
import DeleteIcon from '@mui/icons-material/Delete';

export enum AppCardVariant {
  bloco = 0,
  quadra = 1,
  agendamento = 2,
  add = 3,
}

type AppCardContainerProps = {
  children: ReactNode
  isSelected?: boolean
}
const AppCardContainer = (props: AppCardContainerProps) => (
  <Card sx={{
    height: "120px",
  }}>
    {props.children}
  </Card>
)

const AppCardContent = styled.div<{ isSelected?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  border: ${props => props.isSelected ? '2px solid #63c1ff' : 'none'};
  background-color: ${props => props.isSelected ? "#f0f9ff" : "inherit"};
` 

type CommonProps = {
  onClick?: () => void
}
type AppCardProps = CommonProps & ({
  variant: AppCardVariant.bloco,
  isSelected?: boolean
  bloco: BlocoDTO,
} | {
  variant: AppCardVariant.quadra,
  isSelected?: boolean
  quadra: QuadraDTO
  blocos: BlocoDTO[]
  esportes: EsporteDTO[]
} | {
  variant: AppCardVariant.agendamento,
  agendamento: AgendamentoDTO,
  quadras: QuadraDTO[],
  handleModalDeleteAgendamento: (id: number) => void
} | {
  variant: AppCardVariant.add,
})
export default function AppCard(props: AppCardProps) {
  const { variant } = props

  return (
    <CardActionArea {...props}>
      {
        variant === AppCardVariant.bloco ? (
          <AppCardContainer>
            <AppCardContent isSelected={props.isSelected}>
              <Typography variant="h6">
                {props.bloco.nome}
              </Typography>
            </AppCardContent>
          </AppCardContainer>
        ) : variant === AppCardVariant.quadra ? (
          <AppCardContainer>
            <AppCardContent isSelected={props.isSelected}>
              <Typography variant="h6">
                {props.quadra.nome}
              </Typography>
              <Typography variant="caption">
                {props.blocos.find((b) => b.id === props.quadra.idBloco)?.nome?? "Bloco desconhecido"}
              </Typography>
              <Typography variant="caption">
                {props.esportes.filter((e) => props.quadra.idTiposEsporte?.includes(e.id)).map((e) => e.nome).join(", ")}
              </Typography>
            </AppCardContent>
          </AppCardContainer>
        ) : variant === AppCardVariant.agendamento ? (
          <AppCardContainer>
            <AppCardContent>
              <Typography variant="h6">
                {(props.quadras.find((q) => q.id === props.agendamento.idQuadra))?.nome}
              </Typography>
              <Typography variant="caption">
                Email: {props.agendamento.emailUsuario}, CPF: {props.agendamento.cpfUsuario}
              </Typography>
              <Typography variant="caption">
                {FormatDate(props.agendamento.dataInicio)}
              </Typography>
              <Typography variant="caption">
                de {props.agendamento.horarioInicial} até {props.agendamento.horarioFinal}
              </Typography>
              <div style={{ position: "absolute", right: "4px", bottom: "4px", cursor: "pointer" }}>
                <DeleteIcon fontSize="small" onClick={() => props.handleModalDeleteAgendamento(props.agendamento.id)} />
              </div>
            </AppCardContent>
          </AppCardContainer>
        ) : variant === AppCardVariant.add && (
          <Card sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "120px",
            boxShadow: "none",
            border: "1px dashed #cacaca"
          }}>
            <AddIcon />
          </Card>
        )
      }
    </CardActionArea>
  )
}
