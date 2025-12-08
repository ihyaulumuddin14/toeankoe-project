import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SimpleNavbar({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <nav className="w-full flex justify-start items-center px-5 py-3 border-y gap-4">
      <div
        className="p-2 border aspect-square rounded-md cursor-pointer hover:bg-secondary/10 transition" 
        onClick={() => navigate(-1)}>
          <ChevronLeft />
      </div>
      <h1 className="text-xl font-light">{title}</h1>
    </nav>
  )
}
