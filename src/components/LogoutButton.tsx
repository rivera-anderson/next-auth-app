'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/signIn' })}
      className="text-mist hover:text-alert transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
