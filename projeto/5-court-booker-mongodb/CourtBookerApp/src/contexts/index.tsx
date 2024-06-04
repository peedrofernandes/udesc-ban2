import { ReactNode } from "react";

import AuthProvider from "./auth/Provider";
import ToastProvider from "./toast/Provider";
import ModalProvider from "./modal/Provider";

type ContextProviderProps = {
  children: ReactNode
}
export default function ContextProvider(props: ContextProviderProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>
          {props.children}
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
