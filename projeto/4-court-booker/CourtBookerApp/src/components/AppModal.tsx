import { ReactNode } from "react"
import { Box, Modal } from "@mui/material";

const modalContentStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: "90%",
    sm: 600,
    md: 800,
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

type AppModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}
export default function AppModal(props: AppModalProps) {

  return (
  <Modal open={props.open} onClose={props.onClose}>
    <Box sx={modalContentStyle}>
      {props.children}
    </Box>
  </Modal>
  )
}
