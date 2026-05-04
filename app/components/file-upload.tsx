"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    FilePlus,
    Loader2,
    UploadCloud,
    FileText,
    Music,
    Image as ImageIcon,
    Plus
} from "lucide-react";
import { toast } from "sonner";
import { getPresignedPostUrl } from "@/app/actions/s3";
import { processFileContent } from "../actions/audio";

// Define supported formats for the AI Pipeline
const MimeTypes = {
    PDF: "application/pdf",
    AUDIO: ["audio/mpeg", "audio/wav", "audio/x-wav"],
    IMAGE: ["image/jpeg", "image/png", "image/webp"]
};

export const FileUploader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Expanded Validation
        const isPdf = file.type === MimeTypes.PDF;
        const isAudio = MimeTypes.AUDIO.includes(file.type);
        const isImage = MimeTypes.IMAGE.includes(file.type);

        if (!isPdf && !isAudio && !isImage) {
            return toast.error("Unsupported format. Please upload PDF, Audio, or Images.");
        }

        try {
            setIsUploading(true);

            // 1. Get secure URL from Server Action
            const { url, fileId, key } = await getPresignedPostUrl(file.name, file.type);

            // 2. Upload directly to S3
            const upload = await fetch(url, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            if (upload.ok) {
                // LOGIC UPDATE: Only trigger server-side extraction for PDF or Audio
                // Images are handled directly by the Vision model via their URL
                if (!isImage) {
                    await processFileContent(fileId, key);
                    console.log("Extraction processing started for PDF/Audio");
                } else {
                    console.log("Image upload complete; skipping text extraction.");
                }

                toast.success(`${file.name.split('.').pop()?.toUpperCase()} uploaded successfully`);
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error("Upload failed. Verify AWS S3 permissions.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Upload failed. Verify AWS S3 permissions.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-none shadow-lg shadow-cyan-500/20 px-6 rounded-full transition-all hover:scale-105 active:scale-95">
                    <Plus className="h-4 w-4" />
                    New Process
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#020617] border-slate-800 text-slate-100 sm:max-w-112.5">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold tracking-tight">
                        AI Media Ingestion
                    </DialogTitle>
                    {/* Add this line to fix the console warning */}
                    <DialogDescription className="text-center text-slate-500">
                        Upload documents, audio, or images for automated AI analysis.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-6">
                    <label
                        className={`
                            w-full aspect-square border-2 border-dashed rounded-2xl 
                            flex flex-col items-center justify-center gap-6 cursor-pointer
                            transition-all duration-500 group
                            ${isUploading
                                ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                                : "border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/50"}
                        `}
                    >
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf, .mp3, .wav, .jpg, .jpeg, .png, .webp"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <Loader2 className="h-16 w-16 text-cyan-400 animate-spin" />
                                    <UploadCloud className="h-6 w-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg text-cyan-400">Processing Media...</p>
                                    <p className="text-xs text-slate-500 font-mono">ENCRYPTING & SYNCING TO S3</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-4">
                                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/50 transition-colors">
                                        <FileText className="h-6 w-6 text-violet-400" />
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/50 transition-colors">
                                        <Music className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/50 transition-colors">
                                        <ImageIcon className="h-6 w-6 text-blue-400" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-slate-200">Drop files or click to browse</p>
                                    <p className="text-xs text-slate-500 mt-2">PDF • MP3 • WAV • PNG • JPG</p>
                                </div>
                            </>
                        )}
                    </label>
                </div>

                <div className="px-6 pb-6 text-center">
                    <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
                        Secure AWS Ingest Node
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};