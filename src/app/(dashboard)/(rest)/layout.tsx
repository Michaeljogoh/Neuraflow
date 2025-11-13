import { AppHeader } from "@/components/app-header/app-header";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
