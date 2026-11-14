import type { Metadata } from "next";
import { Big_Shoulders, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Provider from "@/components/SessionProvider";

const shoulders = Big_Shoulders({
  variable: "--font-shoulders",
  subsets: ["latin"],
  axes: ["opsz"],
  adjustFontFallback: false,
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "My Next Auth App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es" className={`${shoulders.variable} ${instrument.variable}`}>
      <body className="antialiased">
        <nav className="h-16 border-b border-line">
          <div className="h-full max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
            <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
              MyAuthApp
            </Link>
            <ul className="flex items-center gap-5 sm:gap-7 text-sm text-mist">
              <li>
                <Link href="/dashboard" className="hover:text-paper transition-colors">
                  Dashboard
                </Link>
              </li>
              {session?.user && (
                <li>
                  <Link href="/profile" className="hover:text-paper transition-colors">
                    Perfil
                  </Link>
                </li>
              )}
              {!session?.user && (
                <li>
                  <Link
                    href="/signIn"
                    className="text-paper border border-line rounded-full px-4 py-1.5 hover:border-paper transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                </li>
              )}
              {session?.user && (
                <li>
                  <LogoutButton />
                </li>
              )}
              {session?.user?.image && (
                <li>
                  <Image
                    height={64}
                    width={64}
                    src={session.user.image}
                    alt="Tu foto de perfil"
                    className="w-8 h-8 rounded-full ring-1 ring-line"
                  />
                </li>
              )}
            </ul>
          </div>
        </nav>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
