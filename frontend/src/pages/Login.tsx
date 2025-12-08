import Input from "@/components/Input";
import AuthLayout from "@/components/layouts/AuthLayout";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound, Lock, Check } from "lucide-react";
import { login as loginService } from "@/services/auth.service";
import Checkbox from "@/components/Checkbox";
import {
  LoginSchema,
  type LoginCredentials,
} from "@/request-schema/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "@/stores/useAuth";
import { AnimatePresence, motion } from "motion/react";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [onPasswordBlur, setOnPasswordBlur] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, accessToken, setUser, setAccessToken] = useAuth(
    useShallow((state) => [
      state.user,
      state.accessToken,
      state.setUser,
      state.setAccessToken,
    ])
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const handleResponseLogin = async (data: LoginCredentials) => {
    const LoginPayload = {
      emailOrUsername: data.emailOrUsername,
      password: data.password,
      rememberMe: rememberMe,
    };
    try {
      const { user, accessToken } = await loginService(LoginPayload);
      setUser(user);
      setAccessToken(accessToken);

      navigate("/", {
        replace: true,
        state: { from: "login" },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  useEffect(() => {
    if (location.state?.from === "register") {
      toast.success("Registrasi berhasil! Silakan login dengan akun kamu yaa");
    }
  }, []);

  return (
    <AuthLayout
      title="Login ke Akunmu"
      welcomeTitle="Halo Toeankoe"
      subtitle="Siap potong rambut dengan gaya terbaikmu hari ini?"
      footer="Belum punya akun?"
      footerUrl="/register"
    >
      <form
        onSubmit={handleSubmit(handleResponseLogin)}
        className="flex flex-col gap-3"
      >
        <Input
          {...register("emailOrUsername")}
          label="Username / Email"
          placeholder="ex. Bahlil"
          error={errors.emailOrUsername?.message}
        >
          <UserRound />
        </Input>
        <div className="flex flex-col gap-1">
          <Input
            {...register("password", { onBlur: () => setOnPasswordBlur(true) })}
            label="Password"
            placeholder="********"
            isPassword
          >
            <Lock />
          </Input>
          <p
            className={`text-xs font-light
              ${
                onPasswordBlur &&
                errors.password &&
                watch("password")?.length > 0
                  ? "text-pink-600"
                  : !errors.password && watch("password")?.length > 0
                  ? "text-green-600"
                  : ""
              }
            `}
          >
            {!errors.password && watch("password")?.length > 0 && (
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="inline mb-1 mr-1" size={14} />
                </motion.span>
              </AnimatePresence>
            )}
            Password minimal 6 karakter
          </p>
        </div>

        <div className="w-full flex justify-between items-center h-fit">
          <label className="flex items-center cursor-pointer" htmlFor="cbx-46">
            <Checkbox checked={rememberMe} onChange={setRememberMe} />
            <span className="text-sm font-light ml-2">Ingatkan saya</span>
          </label>

          <Link to="" className="text-sm font-light">
            Lupa Password?
          </Link>
        </div>
        <Button
          disabled={errors.emailOrUsername || errors.password ? true : false}
          isLoading={isSubmitting}
          type="submit"
        >
          Login
        </Button>
      </form>
    </AuthLayout>
  );
}
