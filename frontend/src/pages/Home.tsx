import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { logout as logoutService } from "@/services/auth.service"
import { Link } from "react-router-dom"
import { useAuth } from "@/stores/authStore"

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAccessToken, setUser } = useAuth()

  const handleLogout = async () => {
    try {
      await logoutService()
      setUser(null)
      setAccessToken("")
      navigate("/login", { replace: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed")
    }
  }

  useEffect(() => {
    if (location.state?.from === "login") {
      toast.success("Selamat datang di Toeankoe Barbershop!")
      
      navigate(location.pathname, {
        replace: true,
        state: null
      })
    }
  }, [location.state])

  return (
    <>
      <div>Your're authorized</div>
      <Link to="/profile">Go to Profile</Link>
      <button className="border " onClick={handleLogout}>Logout</button>
    </>
  )
}
