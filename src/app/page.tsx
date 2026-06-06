"use client";

import React from "react";
import { useStreamStore } from "@/store/use-stream-store";
import Lobby from "@/components/live-stream/lobby";
import StreamContainer from "@/components/live-stream/stream-container";
import { Tv, Radio, Heart } from "lucide-react";

export default function Home() {
  const { isJoined, roomName } = useStreamStore();

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      
      {/* Top Navbar */}
      <header className="border-b border-border/80 bg-black/60 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 select-none">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Tv className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-widest text-white leading-none">
                STUDIO
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

    </div>
  );
}
