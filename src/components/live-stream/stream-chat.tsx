"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat, useParticipants } from "@livekit/components-react";
import { Send, Users } from "lucide-react";

export default function StreamChat() {
  const { send, chatMessages } = useChat();
  const participants = useParticipants();
  const [messageText, setMessageText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      if (send) {
        await send(messageText.trim());
        setMessageText("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/40">
      {/* Header */}
      <div className="p-4 border-b border-border/80 flex items-center justify-between bg-card/85 shrink-0">
        <h3 className="font-bold text-xs tracking-wider uppercase text-neutral-300">Live Chat</h3>
        <div className="flex items-center space-x-1.5 bg-secondary/50 border border-border/60 px-2.5 py-1 rounded-full text-[10px] font-bold text-primary">
          <Users className="w-3.5 h-3.5 animate-pulse" />
          <span>{participants.length}</span>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground/60 space-y-2.5 p-4 text-center">
            <div className="p-3 bg-secondary/30 rounded-full border border-border/40 text-muted-foreground/45">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold">Welcome to the chat!</p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const senderIdentity = msg.from?.identity;
            const messageSenderName = msg.from?.name || senderIdentity || "Anonymous";
            const timestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            
            // Check if sender is local participant
            const isLocal = msg.from?.isLocal;

            return (
              <div key={msg.id || msg.timestamp} className="flex flex-col space-y-0.5 text-xs max-w-full">
                <div className="flex items-baseline space-x-1.5">
                  <span className={`font-bold truncate max-w-[150px] ${
                    isLocal ? "text-primary" : "text-neutral-300"
                  }`}>
                    {messageSenderName}
                  </span>
                  <span className="text-[9px] text-muted-foreground/60 shrink-0">{timestamp}</span>
                </div>
                <div className="bg-secondary/30 border border-border/40 rounded-lg p-2.5 text-neutral-200 break-words leading-relaxed max-w-full">
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message input form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card/85 shrink-0">
        <div className="relative flex items-center bg-secondary border border-border rounded-xl focus-within:border-primary/80 focus-within:ring-1 focus-within:ring-primary/85 transition-all">
          <input
            type="text"
            placeholder="Send a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 outline-none text-xs text-foreground placeholder:text-muted-foreground/50 w-full"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className={`p-2 mr-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
              messageText.trim()
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-white/5"
                : "text-muted-foreground/35 bg-transparent"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
