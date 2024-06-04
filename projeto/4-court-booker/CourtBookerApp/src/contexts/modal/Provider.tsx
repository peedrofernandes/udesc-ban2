import { useState } from "react"
import { Modals } from "."
import ModalContext from "."

type ModalProviderProps = {
  children: React.ReactNode
}

export default function ModalProvider(props: ModalProviderProps) {
  const [modal, setModal] = useState<Modals>(Modals.None)

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      {props.children}
    </ModalContext.Provider>
  )
}
