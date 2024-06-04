import { Box, Button, Typography } from "@mui/material"
import AppModal from "./AppModal"

type ModalExclusaoProps = {
  open: boolean
  handleClose: () => void
  handleSubmit: () => Promise<void>
}

export default function ModalExclusaoEsporte(props: ModalExclusaoProps) {
  return (
    <AppModal open={props.open} onClose={props.handleClose}>
      <Typography>
        Tem certeza que deseja excluir o esporte?
      </Typography>
      <Box sx={{ display: "flex", gap: "4px" }}>
        <Button variant="contained" onClick={props.handleClose}>Não</Button>
        <Button variant="outlined" onClick={props.handleSubmit}>Sim</Button>
      </Box>
    </AppModal>
  )
}
