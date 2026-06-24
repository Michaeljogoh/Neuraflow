import { TemplatesView } from "@/features/templates/components/templates-view";
import { requireAuth } from "@/lib/auth-utils";

export default async function TemplatesPage() {
  await requireAuth();

  return <TemplatesView />;
}
