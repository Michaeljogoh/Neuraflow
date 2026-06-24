import { auth } from "@/lib/auth";
import { ensurePolarCustomer } from "@/lib/ensure-polar-customer";
import { getPremiumAccess } from "@/lib/polar-premium";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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

    const { customer, hasAccess } = await getPremiumAccess(session.user.id);

    return NextResponse.json({
      hasAccess,
      activeSubscriptions: customer.activeSubscriptions ?? [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load premium status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
