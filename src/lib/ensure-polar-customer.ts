import { polarClient } from "./polar";

type PolarUser = {
  id: string;
  email: string;
  name?: string | null;
};

function isPolarNotFound(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  if ("statusCode" in error && error.statusCode === 404) {
    return true;
  }

  if ("status" in error && error.status === 404) {
    return true;
  }

  const message = "message" in error ? String(error.message) : String(error);
  return (
    message.includes("ResourceNotFound") ||
    message.includes('"detail":"Not found"') ||
    message.includes("404")
  );
}

export async function ensurePolarCustomer(user: PolarUser): Promise<void> {
  try {
    await polarClient.customers.getStateExternal({ externalId: user.id });
    return;
  } catch (error) {
    if (!isPolarNotFound(error)) {
      throw error;
    }
  }

  try {
    await polarClient.customers.create({
      email: user.email,
      name: user.name ?? user.email,
      externalId: user.id,
    });
  } catch (error) {
    if (!isPolarNotFound(error)) {
      throw error;
    }
  }
}
