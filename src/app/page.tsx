"use client";

import React from "react";
import { useStreamStore } from "@/store/use-stream-store";
import Lobby from "@/components/live-stream/lobby";
import StreamContainer from "@/components/live-stream/stream-container";
import { Tv, Radio, Heart } from "lucide-react";

export default function Home() {
  const { isJoined, roomName } = useStreamStore();

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black font-sans text-foreground">
      
      {/* Top Navbar */}
      <header className="border-b border-border/80 bg-black/60 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 select-none">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Tv className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-widest text-white leading-none">
                LIVEKIT STUDIO
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold mt-1">
                2-WAY STREAM CLIENT
              </span>
            </div>
          </div>

          {/* Show active status in header when inside a room */}
          {isJoined && roomName && (
            <div className="flex items-center space-x-2 bg-secondary/80 border border-border px-3 py-1.5 rounded-full text-xs font-semibold">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
              <span className="text-muted-foreground">Connected:</span>
              <span className="text-white font-bold">{roomName}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 justify-center">
        {isJoined ? <StreamContainer /> : <Lobby />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-black/45 py-6 shrink-0 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground space-y-3 md:space-y-0">
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />
            <span>using Next.js, LiveKit & Tailwind CSS</span>
          </div>
          <div className="flex space-x-6 font-semibold">
            <a href="https://livekit.io" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              LiveKit Docs
            </a>
            <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              Next.js
            </a>
            <a href="https://zustand.docs.pmnd.rs" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              Zustand
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
