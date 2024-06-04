import { createContext } from "react";

export enum Modals {
  None = 0,
  CriarEsporte = 6,
  CriarBloco = 1,
  CriarQuadra = 2,
  CriarAgendamento = 3,
  CriarBolsista = 7,
  ExclusaoAgendamento = 4,
  ExclusaoEsporte = 5,
}

type ModalContextState = {
  modal: Modals
  setModal: React.Dispatch<React.SetStateAction<Modals>>
}

const ModalContext = createContext<ModalContextState>({
  modal: Modals.None,
  setModal: () => Modals.None,
})

export default ModalContext
