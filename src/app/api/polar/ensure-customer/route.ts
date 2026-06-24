import { auth } from "@/lib/auth";
import { ensurePolarCustomer } from "@/lib/ensure-polar-customer";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensurePolarCustomer({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync Polar customer";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
