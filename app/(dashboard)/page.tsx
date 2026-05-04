import { prisma } from "@/lib/Prisma";
import { redirect } from "next/navigation";
import { FileUploader } from "../components/file-upload";
import { FileTable } from "../components/file-table";
import {
    FileText,
    Zap, // Changed from Clock to represent Groq's speed
    CheckCircle2,
    AlertCircle,
    Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";


export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        return redirect("/auth");
    }

    const files = await prisma.file.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="flex flex-col gap-y-8 lg:p-8 bg-[#020617] h-[80vh] text-slate-100 overflow-hidden">
            {/* Header Section: Static (Doesn't scroll) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        AI Workspace
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Securely processing documents with <span className="text-cyan-400 font-medium">Groq LPU™</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <FileUploader />
                </div>
            </div>

            {/* Scrollable Container: Hide scrollbar but allow scrolling */}
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8 pr-2">

                {/* Stats Overview */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Inventory</CardTitle>
                            <FileText className="h-4 w-4 text-cyan-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-white font-bold">{files.length} Files</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Inference Status</CardTitle>
                            <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400/20" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-white font-bold">
                                {files.filter((f: any) => f.uploadStatus === "COMPLETED").length} <span className="text-sm font-normal text-slate-500 italic">Analyzed</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Cloud Node</CardTitle>
                            <Database className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-white font-bold">AWS RDS</div>
                            <p className="text-[10px] text-cyan-500/70 font-mono mt-1 uppercase tracking-widest">Active Connection</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content: The Glassmorphism Table */}
                <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md shadow-2xl mb-10">
                    <CardHeader className="border-b border-slate-800/50">
                        <CardTitle className="text-lg font-semibold">Document Stream</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {files.length > 0 ? (
                            < div className="text-slate-200">
                                <FileTable data={files} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <AlertCircle className="h-12 w-12 text-slate-700 mb-4" />
                                <h3 className="text-xl font-bold text-slate-200">No documents in the cloud</h3>
                                <p className="text-slate-500 max-w-sm mt-2">
                                    Your S3 bucket is empty. Upload a PDF to start the pipeline.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}