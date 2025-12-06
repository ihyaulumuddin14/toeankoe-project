import { z } from 'zod';

export const LoginSchema = z.object({
  emailOrUsername: z.string().min(3, "Username atau email minimal 3 karakter"),
  password: z.string().min(6, "Password must be at least 6 characters long")
})

export type LoginCredentials = z.infer<typeof LoginSchema>;


export const RegisterSchema = z.object({
  displayName: z.string().min(3, "Display name minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"]
});

export type RegisterCredentials = z.infer<typeof RegisterSchema>;