import Image from 'next/image';

type Props = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string | null;
  expires?: string | null;
  animate?: boolean;
};

const providerLabel: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
  credentials: 'Email y contraseña',
};

function initials(name?: string | null) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export default function AccessPass({ name, email, image, provider, expires, animate = true }: Props) {
  const empty = !name && !email;

  return (
    <div
      className={`pass ${empty ? 'pass-empty' : ''} ${animate ? 'pass-enter' : ''}`}
      role="img"
      aria-label={empty ? 'Pase de acceso sin titular' : `Pase de acceso de ${name ?? email}`}
    >
      <div className="relative h-full flex flex-col justify-between p-[6%]">
        <div className="flex items-start justify-between">
          <span className="font-display text-[clamp(1rem,2.6vw,1.35rem)] font-extrabold tracking-tight leading-none">
            MyAuthApp
          </span>
          {/* chip de la tarjeta */}
          <span
            aria-hidden
            className="block w-[13%] aspect-[1.3] rounded-md border border-ink/25 bg-[linear-gradient(135deg,#f6e7b0,#d8c27a)]"
          />
        </div>

        <div className="flex items-end gap-[5%]">
          <div className="w-[24%] aspect-square shrink-0 rounded-xl overflow-hidden bg-ink/10 border border-ink/15 grid place-items-center">
            {image ? (
              <Image src={image} alt="" width={160} height={160} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display font-extrabold text-[clamp(1.4rem,4vw,2.4rem)] text-ink/70">
                {initials(name)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display font-extrabold leading-[0.9] text-[clamp(1.6rem,5vw,2.6rem)] truncate">
              {name || 'Sin titular'}
            </p>
            <p className="mt-1 text-[clamp(0.7rem,1.6vw,0.9rem)] text-ink/70 truncate">
              {email || 'Identifícate para emitir tu pase'}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between text-[clamp(0.65rem,1.4vw,0.8rem)]">
          <div>
            <p className="text-ink/55">Acceso vía</p>
            <p className="font-semibold">{provider ? providerLabel[provider] ?? provider : '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-ink/55">Estado</p>
            <p className="font-semibold flex items-center gap-1.5 justify-end">
              <span
                aria-hidden
                className={`inline-block w-2 h-2 rounded-full ${empty ? 'bg-ink/30' : 'bg-emerald-600'}`}
              />
              {empty ? 'Sin validar' : expires ? `Válido hasta ${expires}` : 'Activo'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
