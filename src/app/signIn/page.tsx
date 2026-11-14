'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import AccessPass from '@/components/AccessPass';

const MAX_ATTEMPTS = 5;

// Traduce el mensaje de authorize() a cuántos intentos quedan
function attemptsLeft(error: string): number | null {
  if (/bloqueada/i.test(error)) return 0;
  const m = error.match(/quedan (\d+)/i);
  return m ? Number(m[1]) : null;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', { email, password, redirect: false });

    setLoading(false);
    if (result?.ok && !result.error) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result?.error ?? 'No se pudo iniciar sesión. Vuelve a intentarlo.');
    }
  };

  const left = error ? attemptsLeft(error) : null;

  return (
    <main className="min-h-[calc(100dvh-4rem)] max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center py-12">
      <section className="hidden lg:block">
        <h1 className="font-display font-extrabold uppercase leading-[0.82] text-[clamp(4rem,7.5vw,7rem)] tracking-tight">
          Muestra
          <br />
          tu pase
        </h1>
        <p className="mt-6 max-w-sm text-mist text-lg leading-relaxed">
          Entra con tu email y contraseña, o con tu cuenta de Google o GitHub.
        </p>
        <div className="mt-10 max-w-sm">
          <AccessPass />
        </div>
      </section>

      <section className="w-full max-w-md mx-auto lg:mx-0 lg:justify-self-end">
        <h2 className="font-display font-extrabold text-4xl lg:text-3xl tracking-tight">Iniciar sesión</h2>
        <p className="mt-2 text-mist">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-paper underline underline-offset-4 decoration-line hover:decoration-paper">
            Regístrate
          </Link>
        </p>

        <form onSubmit={handleCredentials} className="mt-8 grid gap-5">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" placeholder="tu@correo.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-alert/40 bg-alert/10 px-4 py-3">
              <p className="text-sm text-alert">{error}</p>
              {left !== null && (
                <div className="mt-3 flex items-center gap-1.5" aria-label={`Intentos restantes: ${left} de ${MAX_ATTEMPTS}`}>
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < MAX_ATTEMPTS - left ? 'bg-alert' : 'bg-line'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-1">
            {loading ? 'Comprobando…' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-7 text-sm text-mist">
          <span className="flex-1 h-px bg-line" />
          o entra con
          <span className="flex-1 h-px bg-line" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="btn-provider">
            <FaGoogle aria-hidden /> Google
          </button>
          <button onClick={() => signIn('github', { callbackUrl: '/dashboard' })} className="btn-provider">
            <FaGithub aria-hidden /> GitHub
          </button>
        </div>
      </section>
    </main>
  );
}
