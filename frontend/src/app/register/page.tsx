import { RegisterForm } from "@/components/RegisterForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-black text-xs">
            K
          </div>
          <span className="text-lg font-bold tracking-tighter uppercase italic">Kicker IQ</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <RegisterForm />
      </main>

      <footer className="p-8 text-center opacity-40 text-[10px] uppercase tracking-widest font-bold">
        <p>© 2026 Kicker IQ - Projeto Acadêmico</p>
      </footer>
    </div>
  );
}
