import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/users";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").toLowerCase().trim();
  const password = String(body?.password ?? "");

  if (!name || !email || !password) {
    return Response.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "El email no es válido" }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json(
      { error: "La contraseña debe tener al menos 8 caracteres" },
      { status: 400 }
    );
  }

  try {
    if (await findUserByEmail(email)) {
      return Response.json({ error: "Ya existe una cuenta con ese email" }, { status: 409 });
    }

    // bcrypt genera un "salt" aleatorio y aplica 10 rondas de hashing
    const hashed = await bcrypt.hash(password, 10);

    await createUser({ name, email, password: hashed });

    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json(
      { error: `No se pudo crear la cuenta: ${message}` },
      { status: 500 }
    );
  }
}
