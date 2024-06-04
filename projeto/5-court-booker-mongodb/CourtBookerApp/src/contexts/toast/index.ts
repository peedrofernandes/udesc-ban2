import { createContext } from "react";

export type ToastState = {
  msg: string
  severity: 'success' | 'info' | 'warning' | 'error'
}

type ToastContextState = {
  toast: ToastState | null
  setToast: React.Dispatch<ToastState | null>
}

const ToastContext = createContext<ToastContextState>({
  toast: null,
  setToast: () => null,
})

export default ToastContext
