"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Files,
  Settings,
  Zap,
  Activity,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUploader } from "./file-upload"; // Use the S3 Uploader we built

const routes = [
  {
    label: "Inference Lab", // Dashboard
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-cyan-400",
  },
  {
    label: "S3 Storage", // Documents
    icon: Files,
    href: "/documents",
    color: "text-blue-500",
  },
  {
    label: "System Health", // New: To check Lambda/RDS status
    icon: Activity,
    href: "/status",
    color: "text-emerald-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-slate-400"
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#020617] text-slate-100 w-64 border-r border-slate-800/60 shadow-2xl">
      <div className="px-3 py-2 flex-1">
        {/* Branding Area */}
        <Link href="/" className="flex items-center pl-3 mb-10 group">
          <div className="relative w-9 h-9 mr-3 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:shadow-cyan-500/50 transition-all">
            <Cpu className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl"><span className="text-cyan-400">AI</span> MediaProcessor </span>

            <span className="text-[10px] text-slate-500 font-mono leading-none">v2.0 AWS Node</span>
          </div>
        </Link>

        <div className="space-y-1 px-2">
          {/* Action Button: Using the custom S3 Uploader component */}
          <div className="mb-8">
            <FileUploader />
          </div>

          <p className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Navigation
          </p>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200",
                pathname === route.href
                  ? "text-white bg-slate-900 border border-slate-800 shadow-inner"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3 transition-colors", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Inference Stream Section */}
        <div className="mt-10 px-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Recent Analysis
            </p>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </div>
          </div>

          <ScrollArea className="h-75 mt-2 rounded-xl bg-slate-950/50 border border-slate-900 p-2">
            {/* This maps to your File model in RDS */}
            <div className="flex flex-col gap-2">
              <div className="text-[11px] text-slate-600 p-4 text-center border border-dashed border-slate-800 rounded-lg">
                No active processing streams
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Sidebar Footer: Credits & Security */}
      <div className="px-6 py-4 border-t border-slate-800/60">
        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck size={14} className="text-cyan-500" />
          <span className="text-[10px] font-medium tracking-wide">AES-256 S3 Encryption</span>
        </div>
      </div>
    </div>
  );
}