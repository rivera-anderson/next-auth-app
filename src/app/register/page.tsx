'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AccessPass from '@/components/AccessPass';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden. Escríbelas de nuevo.');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? 'No se pudo crear la cuenta.');
      setLoading(false);
      return;
    }

    // Cuenta creada: iniciamos sesión automáticamente
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.ok && !result.error) {
      router.push('/dashboard');
      router.refresh();
    } else {
      router.push('/signIn');
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthText = ['', 'Muy corta: mínimo 8 caracteres', 'Aceptable', 'Fuerte'][strength];

  return (
    <main className="min-h-[calc(100dvh-4rem)] max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center py-12">
      <section className="hidden lg:block">
        <h1 className="font-display font-extrabold uppercase leading-[0.82] text-[clamp(4rem,7.5vw,7rem)] tracking-tight">
          Emite
          <br />
          tu pase
        </h1>
        <p className="mt-6 max-w-sm text-mist text-lg leading-relaxed">
          Tu pase se completa mientras escribes. La contraseña se guarda cifrada con bcrypt.
        </p>
        <div className="mt-10 max-w-sm">
          <AccessPass name={name || null} email={email || null} provider={name || email ? 'credentials' : null} />
        </div>
      </section>

      <section className="w-full max-w-md mx-auto lg:mx-0 lg:justify-self-end">
        <h2 className="font-display font-extrabold text-4xl lg:text-3xl tracking-tight">Crear cuenta</h2>
        <p className="mt-2 text-mist">
          ¿Ya tienes cuenta?{' '}
          <Link href="/signIn" className="text-paper underline underline-offset-4 decoration-line hover:decoration-paper">
            Inicia sesión
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <input id="name" autoComplete="name" value={name}
              onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" placeholder="tu@correo.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" autoComplete="new-password" minLength={8}
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            {strength > 0 && (
              <div className="flex items-center gap-3 mt-1">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={`h-1 flex-1 rounded-full ${
                      n <= strength ? (strength === 1 ? 'bg-alert' : 'bg-ok') : 'bg-line'
                    }`} />
                  ))}
                </div>
                <span className={`text-xs ${strength === 1 ? 'text-alert' : 'text-mist'}`}>{strengthText}</span>
              </div>
            )}
          </div>
          <div className="field">
            <label htmlFor="confirm">Repite la contraseña</label>
            <input id="confirm" type="password" autoComplete="new-password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-alert/40 bg-alert/10 px-4 py-3 text-sm text-alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-1">
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>
      </section>
    </main>
  );
}
