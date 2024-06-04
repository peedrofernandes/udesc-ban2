import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "../pages/Main";
import Auth from "../pages/Auth";
import { useEffect } from "react";
import { useAuth } from "../contexts/hooks";

export default function AppRoutes() {
  const { auth, setAuth } = useAuth()
  
  const navigate = useNavigate()

  // Navegação conforme login
  useEffect(() => {
    if (auth) {
      console.log("auth exists!")
      localStorage.setItem("auth", JSON.stringify(auth))
      navigate("/")
      return
    } else {
      navigate("/auth")
    }
  }, [auth])

  useEffect(() => {
    const maybeAuth = localStorage.getItem("auth")
    if (maybeAuth) {
      setAuth(JSON.parse(maybeAuth))
      navigate("/")
    } else {
      navigate("/auth")
    }
  }, [])


  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}