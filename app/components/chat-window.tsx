"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! Upload a document, and I'll help you analyze it." }
  ]);

  return (
    <Card className="flex flex-col h-150 w-full max-w-4xl mx-auto shadow-lg border-slate-200">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${msg.role === "bot" ? "bg-primary text-white" : "bg-slate-200"}`}>
              {msg.role === "bot" ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "bot" ? "bg-slate-100 text-slate-800" : "bg-primary text-white"}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder="Ask your documentation a question..." className="flex-1" />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
}