import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps{
    showLink?: boolean;
}


export default function Header({showLink}:HeaderProps) {
  return (
    <header className="px-6 lg:px-20 py-6 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black tracking-tighter uppercase italic">
          Kicker
        </span>
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle />
        {
            showLink &&  (<Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">   Entrar </Link> )
        }
       
        
      </div>
    </header>
  );
}
