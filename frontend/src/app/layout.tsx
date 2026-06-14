import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { AthleteProvider } from "@/context/AthleteContext";

export const metadata: Metadata = {
  title: "Kicker",
  description: "Advanced football player performance analysis",
  icons: {
    icon: "/kicker_shield.svg",
  },
};

// Applies the saved theme (default: dark) before first paint to avoid a
// light-theme flash. Must stay in sync with ThemeProvider's `.dark` toggle.
const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <AthleteProvider>{children}</AthleteProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
