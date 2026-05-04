"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MessageSquare, Trash2, FileText, Music, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react"; // Added
import { deleteFile } from "@/app/actions/delete-file"; // Import your action
import { toast } from "sonner";

export function FileTable({ data }: { data: any[] }) {


  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    setIsDeleting(id);
    const result = await deleteFile(id);

    if (result.success) {
      toast.success("File deleted successfully");
    } else {
      toast.error("Error deleting file");
    }
    setIsDeleting(null);
  };



  // Helper to get icon based on file type
  const getFileIcon = (type: string) => {
    if (type.includes("audio")) return <Music className="h-4 w-4 text-emerald-400" />;
    if (type.includes("image")) return <ImageIcon className="h-4 w-4 text-blue-400" />;
    return <FileText className="h-4 w-4 text-cyan-400" />;
  };

  return (
    <div className="rounded-md border border-slate-800/50 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-900/40">
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">
              Resource
            </TableHead>
            <TableHead className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">
              AI Status
            </TableHead>
            <TableHead className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">
              Processed
            </TableHead>
            <TableHead className="text-right text-slate-400 font-bold uppercase text-[11px] tracking-widest">
              Operations
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((file) => (
            <TableRow
              key={file.id}
              className="border-slate-800/50 hover:bg-slate-900/40 transition-colors group"
            >
              {/* File Name & Icon */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-all">
                    {getFileIcon(file.type)}
                  </div>
                  <span className="font-medium text-slate-100 truncate max-w-50">
                    {file.name}
                  </span>
                </div>
              </TableCell>

              {/* Status Badge with Neon Glow Effect */}
              <TableCell>
                <Badge
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                    file.uploadStatus === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                  )}
                >
                  {file.uploadStatus}
                </Badge>
              </TableCell>

              {/* Date */}
              <TableCell className="text-slate-400 text-sm">
                {format(new Date(file.createdAt), "MMM d, yyyy")}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  >
                    <Link href={`/dashboard/chat/${file.id}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Inference
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting === file.id}
                    onClick={() => handleDelete(file.id)}
                    className={cn(
                      "text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all",
                      isDeleting === file.id && "animate-pulse opacity-50"
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


