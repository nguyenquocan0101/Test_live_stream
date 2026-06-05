"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LiveKitRoom } from "@livekit/components-react";
import { useStreamStore } from "@/store/use-stream-store";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import StreamVideo from "./stream-video";
import StreamControls from "./stream-controls";
import StreamChat from "./stream-chat";

async function fetchLiveKitToken(roomName: string, participantName: string, role: string) {
  const res = await fetch("/api/livekit/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName, participantName, role }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch LiveKit token");
  }

  return res.json(); // returns { token, serverUrl }
}

export default function StreamContainer() {
  const {
    roomName,
    participantName,
    role,
    localVideoEnabled,
    localAudioEnabled,
    isChatOpen,
    setIsJoined,
    reset,
  } = useStreamStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["livekit-token", roomName, participantName, role],
    queryFn: () => fetchLiveKitToken(roomName, participantName, role),
    enabled: !!roomName && !!participantName,
    staleTime: Infinity,
  });

  const handleLeave = () => {
    setIsJoined(false);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold">Generating stream credentials...</p>
          <p className="text-xs text-muted-foreground mt-1">Establishing secure WebRTC session parameters</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-md w-full bg-card border border-border/80 p-6 md:p-8 rounded-2xl shadow-xl space-y-6 text-center">
          <div className="p-3 bg-destructive/10 rounded-full w-fit mx-auto border border-destructive/20 text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Connection Failed</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error instanceof Error ? error.message : "Unable to connect to the token provider service."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLeave}
              className="flex-1 bg-secondary hover:bg-muted text-foreground border border-border font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lobby</span>
            </button>
            <button
              onClick={() => refetch()}
              className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={data.token}
      serverUrl={data.serverUrl}
      connect={true}
      video={localVideoEnabled && role === "host"}
      audio={localAudioEnabled && role === "host"}
      className="flex flex-col md:flex-row min-h-[90vh] bg-background text-foreground relative border border-border/40 rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Video stream content area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <StreamVideo />
        <StreamControls onLeave={handleLeave} />
      </div>

      {/* Chat drawer panel */}
      {isChatOpen && (
        <div className="w-full md:w-[360px] border-t md:border-t-0 md:border-l border-border bg-card flex flex-col min-h-[350px] md:min-h-0 md:h-[90vh]">
          <StreamChat />
        </div>
      )}
    </LiveKitRoom>
  );
}
