import { useContext, createContext, useState } from "react"
import type { User } from "@/type/type"
import { toast } from "sonner"

type AuthProviderType = {
  children: React.ReactNode
}

type LoginPayload = {
  email: string,
  password: string
}

type ContextValueType = {
  user: User,
  accessToken?: string,
  login: (payload: LoginPayload) => Promise<void>,
  logout: () => void
}

const AuthContext = createContext<null | ContextValueType>(null) 


export function AuthProvider({ children }: AuthProviderType) {
  const [user, setUser] = useState<null | User>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const login = async (payload: LoginPayload) => {
    const { email, password } = payload

    const response = await fetch(`${import.meta.env.API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    const data = await response.json()

    if (data) {
      const { id, email, role, displayName } = data.user
      const user = {
        id,
        email,
        role,
        displayName
      }
      setUser(user)
      setAccessToken(data.accessToken)
    } else {
      throw new Error()
    }
  }

  const logout = async () => {
    const response = await fetch(`${import.meta.env.API_URL}/auth/logout`, {
      method: 'POST',
      credentials: "include"
    })

    const data = await response.json()
    if (data) {
      setUser(null)
      setAccessToken(undefined)
      toast.success("Logout successful")
    } else {
      throw new Error()
    }
  }

  const value = {
    user,
    login,
    logout
  } as ContextValueType

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  )
}




export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error("useAuth must be used inside AuthProvider")

  return context
}