import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";


export default function Layout({ children }: {children: React.ReactNode}) {
  return (
    <div>
        <SidebarProvider>
          <AppSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    </div>
  )
}
