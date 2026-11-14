import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AccessPass from '@/components/AccessPass';

const providerLabel: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
  credentials: 'email y contraseña',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0] ?? 'de nuevo';
  const expires = session?.expires
    ? new Date(session.expires).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
    : null;
  const expiresLong = session?.expires
    ? new Date(session.expires).toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })
    : null;

  return (
    <main className="min-h-[calc(100dvh-4rem)] max-w-6xl mx-auto px-5 sm:px-8 py-14 lg:py-20">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-14 lg:gap-20 items-center">
        <section>
          <p className="text-mist text-lg">Estás dentro.</p>
          <h1 className="mt-2 font-display font-extrabold uppercase leading-[0.82] tracking-tight text-[clamp(4rem,11vw,9.5rem)] break-words">
            Hola,
            <br />
            {firstName}
          </h1>

          <dl className="mt-12 grid sm:grid-cols-2 gap-px bg-line border border-line rounded-xl overflow-hidden max-w-xl">
            <div className="bg-ink p-5">
              <dt className="text-sm text-mist">Entraste con</dt>
              <dd className="mt-1 text-lg font-medium">
                {session?.provider ? providerLabel[session.provider] ?? session.provider : '—'}
              </dd>
            </div>
            <div className="bg-ink p-5">
              <dt className="text-sm text-mist">Tu sesión vence</dt>
              <dd className="mt-1 text-lg font-medium">{expiresLong ?? '—'}</dd>
            </div>
          </dl>

          <Link
            href="/profile"
            className="mt-8 inline-flex items-center rounded-full border border-line px-5 py-2.5 hover:border-paper transition-colors"
          >
            Ver mi perfil
          </Link>
        </section>

        <section className="max-w-md w-full mx-auto lg:mx-0">
          <AccessPass
            name={user?.name}
            email={user?.email}
            image={user?.image}
            provider={session?.provider}
            expires={expires}
          />
        </section>
      </div>
    </main>
  );
}
