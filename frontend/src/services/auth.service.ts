import HttpError from "@/errors/http-error"

type RegisterPayload = {
  displayName: string,
  email: string,
  password: string
}

type LoginPayload = {
  emailOrUsername: string,
  password: string,
  rememberMe: boolean
}

export const register = async ({ displayName, email, password }: RegisterPayload) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      displayName,
      email,
      password
    }),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })

  const data = await response.json()

  if (!response.ok) {
    throw new HttpError(response.status, data.error || 'Registration failed')
  }
  return data
}


export const login = async ({ emailOrUsername, password, rememberMe }: LoginPayload) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      emailOrUsername,
      password,
      rememberMe
    }),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new HttpError(response.status, data.error || 'Login failed')
  } else {
    const { _id, email, role, displayName } = data.user
    const user = {
      _id,
      email,
      role,
      displayName
    }
    return {
      user,
      message: data.message,
      accessToken: data.accessToken
    }
  }
}


export const logout = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: "include"
  })

  const data = await response.json()
  if (!response.ok) {
    throw new HttpError(response.status, data.error || 'Logout failed')
  } else {
    return data
  }
}