import Header from "@/components/Header";
import { RegisterForm } from "@/components/RegisterForm";


export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Header showLink={false} />

      <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <RegisterForm />
      </main>

      <footer className="p-8 text-center opacity-40 text-[10px] uppercase tracking-widest font-bold">
        <p>© 2026 Kicker IQ</p>
      </footer>
    </div>
  );
}
