import AuthLayout from '@/components/layouts/AuthLayout'
import Input from '@/components/Input'
import { UserRound, Lock, Mail, ShieldCheck, Check } from 'lucide-react'
import Button from '@/components/Button'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import type { RegisterCredentials } from '@/request-schema/AuthSchema'
import { RegisterSchema } from '@/request-schema/AuthSchema';
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { register as registerService } from '@/services/auth.service'
import { error } from 'console'
import { AnimatePresence, motion } from 'motion/react'

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors }
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange"
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
          <Input {...register('displayName')} label="Display Name" placeholder="ex. Bahlil" error={errors.displayName?.message}>
            <UserRound />
          </Input>
          <Input {...register('email')} label="Email" placeholder="m@example.com" error={errors.email?.message}>
            <Mail />
          </Input>
          <Input {...register('password')} label="Password" isPassword placeholder="********" error={errors.password?.message}>
            <Lock />
          </Input>
          <div className='flex flex-col gap-1'>
            <Input {...register('confirmPassword')} label="Confirm Password" isPassword placeholder="********" error={errors.confirmPassword?.message}>
              <ShieldCheck />
            </Input>
              { watch("confirmPassword")?.length > 0 && !errors.confirmPassword &&
                <AnimatePresence>
                  <motion.div
                    className='text-xs font-light text-green-600'
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    >
                    <Check className="inline mb-1 mr-1" size={14}/>
                    Password cocok
                  </motion.div>
                </AnimatePresence>
              }
          </div>
          <Button isLoading={isSubmitting} type='submit'>Daftar</Button>
        </form>
    </AuthLayout>
  )
}
