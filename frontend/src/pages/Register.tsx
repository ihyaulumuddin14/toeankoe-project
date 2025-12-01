import AuthLayout from '@/components/layouts/AuthLayout'
import Input from '@/components/Input'
import { UserRound, Lock, Mail, ShieldCheck } from 'lucide-react'
import Button from '@/components/Button'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import type { RegisterCredentials } from '@/request-schema/AuthSchema'
import { RegisterSchema } from '@/request-schema/AuthSchema';
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { register as registerService } from '@/services/auth.service'

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(RegisterSchema)
  })

  const handleResponseRegister = async (data: RegisterCredentials) => {
    const RegisterPayload = {
      displayName: data.displayName,
      email: data.email,
      password: data.password
    }
    
    try {
      await registerService(RegisterPayload)
      navigate("/login", {
        replace: true,
        state: { from: location.pathname }
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed")
    }
  }

  return (
    <AuthLayout
      title="Daftar Akun"
      welcomeTitle="Selamat Datang di Toeankoe"
      subtitle='Daftarkan akun kamu biar bisa dapetin fitur menarik dari Toeankoe'
      footer="Sudah punya akun?"
      footerUrl="/login"
      >
        <form onSubmit={handleSubmit(handleResponseRegister)} className='flex flex-col gap-2'>
          <Input {...register('displayName')} label="Display Name" placeholder="ex. Bahlil">
            <UserRound />
          </Input>
          <Input {...register('email')} label="Email" placeholder="m@example.com">
            <Mail />
          </Input>
          <Input {...register('password')} label="Password" isPassword placeholder="********">
            <Lock />
          </Input>
          <Input {...register('confirmPassword')} label="Confirm Password" isPassword placeholder="********">
            <ShieldCheck />
          </Input>
          <Button isLoading={isSubmitting} type='submit'>Daftar</Button>
        </form>
    </AuthLayout>
  )
}
