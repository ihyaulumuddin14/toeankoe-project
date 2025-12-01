import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/stores/authStore'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from './api/axiosInstance'

export default function ProtectedRoute() {
  const { user, accessToken, setAccessToken } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isTokenValid = (accessToken: string) => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(accessToken)
      if (Date.now() >= exp * 1000) {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }

  const refresh = async () => {
    try {
      const response = await api.post('/auth/refresh')
      const data = response.data
      setAccessToken(data.newAccessToken)
      toast.success(data.message)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed")
      navigate("/login", {
        replace: true,
        state: { from: location.pathname }
      })
    }
  }

  useEffect(() => {
    if (!accessToken || !user) {
      refresh()
    }
  }, [])

  
  useEffect(() => {
    if (!accessToken) return

    if (!isTokenValid(accessToken)) {
      console.log("Access token expired, refreshing...")
      const isRefresh = confirm("Session expired. Do you want to refresh your session?")
      if (isRefresh) {
        refresh()
      } else {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname }
        })
      }
    }
  }, [accessToken, location.pathname])

  return (
    <Outlet />
  )
}
