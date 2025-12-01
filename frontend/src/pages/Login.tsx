import Input from "@/components/Input"
import AuthLayout from "@/components/layouts/AuthLayout"
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound, Lock } from "lucide-react";
import { login as loginService } from "@/services/auth.service";
import Checkbox from "@/components/Checkbox";
import { LoginSchema, type LoginCredentials } from "@/request-schema/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useShallow } from 'zustand/react/shallow'
import { useAuth } from "@/stores/authStore";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, accessToken, setUser, setAccessToken] = useAuth(
    useShallow(state => [state.user, state.accessToken, state.setUser, state.setAccessToken])
  )
        
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema)
  })

  const handleResponseLogin = async (data: LoginCredentials) => {
    const LoginPayload = {
      emailOrUsername: data.emailOrUsername,
      password: data.password,
      rememberMe: rememberMe
    }
    try {
      const { user, accessToken } = await loginService(LoginPayload)
      setUser(user)
      setAccessToken(accessToken)
      
      navigate("/", {
        replace: true,
        state: { from: "login" }
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed" )
    }
  }

  useEffect(() => {
    if (location.state?.from === "register") {
      toast.success("Registrasi berhasil! Silakan login dengan akun kamu yaa")
    }
  }, [])

  return (
    <AuthLayout
      title="Login ke Akunmu"
      welcomeTitle="Halo Toeankoe"
      subtitle="Siap potong rambut dengan gaya terbaikmu hari ini?"
      footer="Belum punya akun?"
      footerUrl="/register"
    >
      <form onSubmit={handleSubmit(handleResponseLogin)} className='flex flex-col gap-2'>
        <Input {...register("emailOrUsername")} label="Username / Email" placeholder="ex. Bahlil">
          <UserRound />
        </Input>
        <Input {...register("password")} label="Password" placeholder="********" isPassword>
          <Lock />
        </Input>
        <div className="w-full flex justify-between items-center h-fit">
          <label className="flex items-center cursor-pointer" htmlFor="cbx-46">
            <Checkbox checked={rememberMe} onChange={setRememberMe}/>
            <span className="text-sm font-light ml-2">Ingatkan saya</span>
          </label>

          <Link to="" className="text-sm font-light">Lupa Password?</Link>
        </div>
        <Button isLoading={isSubmitting} type="submit">Login</Button>
      </form>
    </AuthLayout>
  )
}