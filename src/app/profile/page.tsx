import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AccessPass from '@/components/AccessPass';

const providerLabel: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
  credentials: 'Email y contraseña',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const expires = session?.expires
    ? new Date(session.expires).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
    : null;

  const rows = [
    { label: 'Nombre', value: user?.name },
    { label: 'Email', value: user?.email },
    { label: 'Proveedor', value: session?.provider ? providerLabel[session.provider] ?? session.provider : null },
    { label: 'Foto', value: user?.image ? 'Importada del proveedor' : 'Sin foto: se muestran tus iniciales' },
  ];

  return (
    <main className="min-h-[calc(100dvh-4rem)] max-w-6xl mx-auto px-5 sm:px-8 py-14 lg:py-20">
      <h1 className="font-display font-extrabold uppercase leading-[0.85] tracking-tight text-[clamp(3.5rem,8vw,6.5rem)]">
        Tu perfil
      </h1>

      <div className="mt-12 grid lg:grid-cols-[1fr_1fr] gap-14 lg:gap-20 items-start">
        <div className="max-w-lg w-full">
          <AccessPass
            name={user?.name}
            email={user?.email}
            image={user?.image}
            provider={session?.provider}
            expires={expires}
          />
        </div>

        <dl className="divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[8rem_1fr] gap-4 py-5">
              <dt className="text-mist">{row.label}</dt>
              <dd className="font-medium break-words">{row.value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
