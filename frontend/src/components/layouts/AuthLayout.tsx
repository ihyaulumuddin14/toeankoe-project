import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SimpleNavbar from "../SimpleNavbar";

type AuthLayoutType = {
  children: React.ReactNode,
  title: string,
  welcomeTitle: string,
  subtitle?: string
  footer: string,
  footerUrl: string
}

export default function AuthLayout({
  children,
  title,
  welcomeTitle,
  subtitle,
  footer,
  footerUrl
} : AuthLayoutType) {
  return (
    <section className="w-full h-screen flex flex-col justify-start items-center">
      <SimpleNavbar title={title}/>

      <header className="w-xs flex flex-col justify-center items-center gap-5 my-6">
        <img src="/logo.png" alt="logo" />
        <h2 className="font-bold text-3xl text-center">{welcomeTitle}</h2>
        <p className="text-sm font-light text-center">{subtitle}</p>
      </header>

      <main className="w-full max-w-lg p-5">
        {children}
      </main>

      <footer>
        <p className="text-sm flex gap-1 font-light">
          {footer}
          <Link to={footerUrl} className="text-accent-foreground font-medium">
            {footerUrl === '/login' ? 'Login' : 'Register'}
          </Link>
        </p>
      </footer>
    </section>
  )
}
