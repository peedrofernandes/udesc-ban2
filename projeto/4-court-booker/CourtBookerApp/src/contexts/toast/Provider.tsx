import { useState } from "react"
import AuthContext, { ToastState } from "."

type ToastProviderProps = {
  children: React.ReactNode
}

export default function ToastProvider(props: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null)

  return (
    <AuthContext.Provider value={{ toast, setToast }}>
      {props.children}
    </AuthContext.Provider>
  )
}
