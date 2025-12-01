import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { logout as logoutService } from "@/services/auth.service"
import { Link } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logoutService()
      navigate("/login", { replace: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed")
    }
  }

  useEffect(() => {
    if (location.state?.from === "login") {
      toast.success("Selamat datang di Toeankoe Barbershop!")
      location.state.from = null
    }
  }, [])

  return (
    <>
      <div>Your're authorized</div>
      <Link to="/profile">Go to Profile</Link>
      <button className="border " onClick={handleLogout}>Logout</button>
    </>
  )
}
