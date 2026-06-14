import Header from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";


export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-1 text-fg">
      <Header showLink={false}/>


      <main className="flex-1 flex items-center justify-center p-6">
        <LoginForm />
      </main>

      <footer className="p-8 text-center text-fg-subtle text-sm">
        <p>© 2026 Kicker</p>
      </footer>
    </div>
  );
}
