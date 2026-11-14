import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  updateLoginState,
  MAX_FAILED_ATTEMPTS,
  LOCK_TIME_MS,
} from "./users";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("Ingresa tu email y contraseña");
        }

        let user;
        try {
          user = await findUserByEmail(email);
        } catch (err) {
          console.error("[credentials]", err);
          throw new Error("No se pudo conectar con la base de datos");
        }
        if (!user) {
          throw new Error("Email o contraseña incorrectos");
        }

        // ¿Está bloqueada la cuenta?
        const lockUntil = user.lock_until ? new Date(user.lock_until).getTime() : 0;
        if (lockUntil > Date.now()) {
          const minutes = Math.ceil((lockUntil - Date.now()) / 60000);
          throw new Error(
            `Cuenta bloqueada por demasiados intentos. Intenta de nuevo en ${minutes} min`
          );
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          const attempts = (user.failed_attempts ?? 0) + 1;

          if (attempts >= MAX_FAILED_ATTEMPTS) {
            await updateLoginState(user.id, 0, new Date(Date.now() + LOCK_TIME_MS));
            throw new Error(
              `Cuenta bloqueada por ${LOCK_TIME_MS / 60000} min tras ${MAX_FAILED_ATTEMPTS} intentos fallidos`
            );
          }

          await updateLoginState(user.id, attempts, null);
          throw new Error(
            `Email o contraseña incorrectos. Te quedan ${MAX_FAILED_ATTEMPTS - attempts} intentos`
          );
        }

        // Login correcto: reiniciamos el contador
        await updateLoginState(user.id, 0, null);

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Guardamos con qué proveedor entró el usuario para mostrarlo en su pase
    async jwt({ token, account }) {
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      session.provider = token.provider;
      return session;
    },
  },
  pages: { signIn: "/signIn" },
  secret: process.env.NEXTAUTH_SECRET,
};
