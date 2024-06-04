import { Box, Button, Card, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material"
import { EsporteDTO } from "../services/EsporteService"
import { QuadraDTO } from "../services/QuadraService"
import styled from "styled-components"
import { Delete } from "@mui/icons-material"

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const CustomList = styled(List)`
  max-height: 180px;
  width: 380px;
  overflow-y: auto;
`;

type GerenciarEsportesProps = {
  esportes: EsporteDTO[]
  quadras: QuadraDTO[]
  handleModalCriarEsporte: () => void
  handleCriarEsporte: (nome: string) => Promise<void>
  handleModalExcluirEsporte: (id: number) => void
  handleExcluirEsporte: (id: number) => Promise<void>
}
export default function GerenciarEsportes(props: GerenciarEsportesProps) {


  return (
    <Container>

    <Card sx={{ padding: "16px",  display: "flex", flexDirection: "column", gap: "8px" }}>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Esportes</Typography>
        <Button variant="contained" onClick={props.handleModalCriarEsporte}>Criar</Button>
      </Box>

      <Box>

        <CustomList>
          {props.esportes.map((e) => (
            <ListItem
              key={e.id}
              secondaryAction={
                <IconButton aria-label="delete-esporte" onClick={() => props.handleModalExcluirEsporte(e.id)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText>
                {e.nome}
              </ListItemText>
            </ListItem>
          ))}
        </CustomList>

      </Box>
    </Card>

    </Container>
  )
}