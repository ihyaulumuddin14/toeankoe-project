import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/stores/authStore'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from './api/axiosInstance'
import HttpError from './errors/http-error'
import { useShallow } from 'zustand/react/shallow'

export default function ProtectedRoute() {
  const { user, accessToken } = useAuth(
    useShallow((state) => ({
      user: state.user,
      accessToken: state.accessToken
    }))
  )
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
      const response = await api.get('/user/me')
      const data = response.data

      if (response.status !== 200) {
        throw new HttpError(response.status, data.error || 'Failed to refresh token')
      }
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
