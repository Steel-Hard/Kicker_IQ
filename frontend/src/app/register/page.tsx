import Header from "@/components/Header";
import { RegisterForm } from "@/components/RegisterForm";


export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-1 text-fg font-sans">
      <Header showLink={false} />

      <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <RegisterForm />
      </main>

      <footer className="p-8 text-center text-fg-subtle text-[10px] uppercase tracking-widest font-bold">
        <p>© 2026 Kicker</p>
      </footer>
    </div>
  );
}
