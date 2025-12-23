import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body ?? {};

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Name, email and password required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return new Response(JSON.stringify({ ok: true, user: safeUser }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Register error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
