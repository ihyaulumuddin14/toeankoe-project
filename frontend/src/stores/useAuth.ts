import type { User } from "@/type/type";
import { create } from "zustand";

type AuthStateType = {
  user: User | null
  accessToken: string
  setUser: (user: User | null) => void
  setAccessToken: (accessToken: string) => void
}

export const useAuth = create<AuthStateType>()((set) => ({
  user: null,
  accessToken: "",
  setUser: (user) => {
    set({ user })
  },
  setAccessToken: (accessToken) => {
    set({ accessToken })
  }
}))