import Nav from "@/components/Nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
export default function MainLayout() {
  return (
    <div className="flex">
      <SidebarProvider>
        <Nav />
        <div className="flex-1">
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
