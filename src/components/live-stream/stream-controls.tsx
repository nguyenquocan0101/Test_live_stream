"use client";

import React from "react";
import { useLocalParticipant } from "@livekit/components-react";
import { useStreamStore } from "@/store/use-stream-store";
import { 
  Mic, MicOff, Camera, CameraOff, Monitor, MonitorOff, 
  MessageSquare, MessageSquareOff, LogOut, RefreshCw
} from "lucide-react";

interface StreamControlsProps {
  onLeave: () => void;
}

export default function StreamControls({ onLeave }: StreamControlsProps) {
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled } = useLocalParticipant();
  const { isChatOpen, toggleChat, role, setRoomInfo, roomName, participantName } = useStreamStore();

  const handleToggleMic = async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    }
  };

  const handleToggleCamera = async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
    }
  };

  const handleToggleScreenShare = async () => {
    if (localParticipant) {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    }
  };

  // Swap role dynamically to test 2-way streams without leaving lobby manually
  const handleSwapRole = () => {
    const nextRole = role === "host" ? "viewer" : "host";
    setRoomInfo(roomName, participantName, nextRole);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-border/80 flex items-center space-x-3.5 shadow-2xl z-20 max-w-[95vw] md:max-w-none overflow-x-auto whitespace-nowrap">
      
      {/* Mic Toggle (Host Only) */}
      {role === "host" && (
        <button
          onClick={handleToggleMic}
          className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
            isMicrophoneEnabled
              ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(255,255,255,0.05)]"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
          title={isMicrophoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      )}

      {/* Camera Toggle (Host Only) */}
      {role === "host" && (
        <button
          onClick={handleToggleCamera}
          className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
            isCameraEnabled
              ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(255,255,255,0.05)]"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
          title={isCameraEnabled ? "Disable Camera" : "Enable Camera"}
        >
          {isCameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
        </button>
      )}

      {/* Screen Share (Host Only) */}
      {role === "host" && (
        <button
          onClick={handleToggleScreenShare}
          className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
            isScreenShareEnabled
              ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(255,255,255,0.05)]"
              : "bg-secondary hover:bg-muted border-border text-muted-foreground"
          }`}
          title={isScreenShareEnabled ? "Stop Screen Share" : "Start Screen Share"}
        >
          {isScreenShareEnabled ? <Monitor className="w-5 h-5" /> : <MonitorOff className="w-5 h-5" />}
        </button>
      )}

      {/* Role Switcher (Helper for testing 2-way streaming easily) */}
      <button
        onClick={handleSwapRole}
        className="p-3 rounded-xl border border-border bg-secondary hover:bg-muted text-foreground transition-all flex items-center justify-center cursor-pointer"
        title={`Switch role to ${role === "host" ? "Viewer" : "Host"}`}
      >
        <RefreshCw className="w-5 h-5 text-primary" />
      </button>

      {/* Divider */}
      <div className="w-[1px] h-6 bg-border/80 hidden sm:block" />

      {/* Chat Panel Toggle */}
      <button
        onClick={toggleChat}
        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
          isChatOpen
            ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(255,255,255,0.05)]"
            : "bg-secondary hover:bg-muted border-border text-muted-foreground"
        }`}
        title={isChatOpen ? "Hide Chat" : "Show Chat"}
      >
        {isChatOpen ? <MessageSquare className="w-5 h-5" /> : <MessageSquareOff className="w-5 h-5" />}
      </button>

      {/* Leave Room Button */}
      <button
        onClick={onLeave}
        className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all duration-200 cursor-pointer"
        title="Leave Room"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
