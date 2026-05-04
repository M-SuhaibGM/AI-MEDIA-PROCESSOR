"use client"

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { DefaultChatTransport } from "ai";  // ← import this

export default function ChatInterface({ fileId }: { fileId: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Manually manage input state as per new docs
    const [input, setInput] = useState('');
    // 2. Destructure using the new sendMessage pattern

    const { messages, sendMessage, error } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
            prepareSendMessagesRequest: ({ messages }) => ({
                body: {
                    messages,
                    fileId,  // pass fileId here
                },
            }),
        }),
    });
    // Determine loading state based on the last message
    const isLoading = messages.length > 0 && messages[messages.length - 1].role === 'user';

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Chat Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Bot size={40} />
                        <p className="text-sm">Ask me anything about this document!</p>
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 flex gap-3 shadow-sm ${m.role === 'user'
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-900 rounded-tl-none'
                            }`}>
                            <div className="shrink-0 mt-1">
                                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            {/* 3. Render using the 'parts' array as per new docs */}
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {m.parts.map((part, i) => {
                                    if (part.type === 'text') {
                                        return <span key={i}>{part.text}</span>;
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 rounded-2xl p-4 flex gap-2 items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                            <span className="text-xs text-slate-500">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Form submission using sendMessage */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!input.trim()) return;
                    sendMessage({ text: input },
                        {
                            body: { fileId } // Metadata sent separately from the messages array
                        }
                    );
                    setInput('');
                }}
                className="p-4 border-t bg-slate-50 flex gap-2"
            >
                <input
                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-black"
                    value={input}
                    placeholder="Say something..."
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-slate-900 text-white px-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 shadow-md"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}