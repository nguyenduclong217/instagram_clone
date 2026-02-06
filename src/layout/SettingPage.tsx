import { SidebarProvider } from "@/components/ui/sidebar";
import EditProfilePage from "@/pages/EditProfilePage";
import { Outlet } from "react-router-dom";
export default function SettingPage() {
  return (
    <div className="flex">
      <SidebarProvider>
        <EditProfilePage />
        <div className="flex-1">
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
