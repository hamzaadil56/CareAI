import { Outlet } from "react-router";
import { useState } from "react";
import { LayoutDashboard, Users, DollarSign, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <div className="flex h-screen text-2xl">
      <div
        className={`${
          isDrawerOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out`}
      >
        <div
          className={`${
            isDrawerOpen ? "block bg-slate-100" : "hidden"
          } h-full bg-gray-300 border-r`}
        >
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center px-3 mb-4">
              <h2 className="text-3xl px-3 font-semibold tracking-tight">
                Care AI
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-1 px-3">
              <Button variant="ghost" className="w-full justify-start text-lg">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg">
                <Users className="mr-2 h-4 w-4" />
                Patients
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg">
                <DollarSign className="mr-2 h-4 w-4" />
                Donations
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* will either be <Home/> or <Settings/> */}
      <div
        className={`flex-1 p-8 ${
          isDrawerOpen ? "ml-0" : "ml-0"
        } overflow-y-auto transition-all duration-300 ease-in-out`}
      >
        {/* Mobile/Collapsed Drawer Toggle */}
        {!isDrawerOpen && (
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 w-8 h-8 text-2xl"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu className="w-full " />
          </Button>
        )}

        <Outlet />
      </div>
    </div>
  );
}
