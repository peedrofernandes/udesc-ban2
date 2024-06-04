import { useContext } from "react"
import AuthContext from "./auth"
import ToastContext from "./toast"
import ModalContext from "./modal"

export function useAuth() {
  return useContext(AuthContext)
}

export function useToast() {
  return useContext(ToastContext)
}

export function useModal() {
  return useContext(ModalContext)
}
