import { z } from 'zod';

export const LoginSchema = z.object({
  emailOrUsername: z.string().min(3, "Username or email must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long")
})

export type LoginCredentials = z.infer<typeof LoginSchema>;


export const RegisterSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type RegisterCredentials = z.infer<typeof RegisterSchema>;