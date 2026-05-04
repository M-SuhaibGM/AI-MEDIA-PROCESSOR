import { UserButton } from "./user-button"; // We'll make this next
import { MobileSidebar } from "./mobile-sidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <div className="flex items-center p-4 border-b bg-white shadow-sm">
      {/* Mobile Sidebar Trigger */}
      <MobileSidebar />

      <div className="flex w-full justify-between items-center ml-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-8 bg-slate-50 border-none" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-x-4">
           <UserButton />
        </div>
      </div>
    </div>
  );
}