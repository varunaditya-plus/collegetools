import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col h-dvh w-screen overflow-hidden antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Header />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
            <div className="relative flex min-h-0 flex-1 gap-0 p-0 sm:gap-2 sm:pr-2 sm:pb-2">
              <main className="flex min-h-0 flex-1 shrink flex-col overflow-hidden rounded-none border-0 bg-background sm:rounded-2xl sm:border-2 sm:border-border">
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                  <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-16">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}