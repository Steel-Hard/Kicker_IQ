import { LoginForm } from "@/components/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-black">
            K
          </div>
          <span className="text-xl font-bold tracking-tight">Kicker </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <LoginForm />
      </main>

      <footer className="p-8 text-center opacity-40 text-sm">
        <p>© 2026 Kicker IQ - Projeto Acadêmico</p>
      </footer>
    </div>
  );
}
