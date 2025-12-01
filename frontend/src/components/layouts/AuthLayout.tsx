import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <section className="w-full h-screen flex flex-col justify-start items-center">
      <nav className="w-full flex justify-start items-center px-5 py-3 border-y gap-4">
        <div
          className="p-2 border aspect-square rounded-md cursor-pointer hover:bg-secondary/10 transition" 
          onClick={() => navigate(-1)}>
            <ChevronLeft />
        </div>
        <h1 className="text-xl font-light">{title}</h1>
      </nav>

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
