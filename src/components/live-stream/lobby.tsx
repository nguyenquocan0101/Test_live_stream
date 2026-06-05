"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStreamStore } from "@/store/use-stream-store";
import { Camera, CameraOff, Mic, MicOff, Tv, User, Users, Video } from "lucide-react";

export default function Lobby() {
  const {
    roomName,
    participantName,
    role,
    localVideoEnabled,
    localAudioEnabled,
    setRoomInfo,
    setIsJoined,
    setLocalVideoEnabled,
    setLocalAudioEnabled,
  } = useStreamStore();

  const [inputRoom, setInputRoom] = useState(roomName || "livestream-room");
  const [inputName, setInputName] = useState(participantName);
  const [inputRole, setInputRole] = useState<"host" | "viewer">(role);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Handle local camera preview
  useEffect(() => {
    async function startPreview() {
      // Clean up previous stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (!localVideoEnabled) {
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: localAudioEnabled,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError("Could not access camera/microphone. Please check permissions.");
        setLocalVideoEnabled(false);
      }
    }

    startPreview();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localVideoEnabled, localAudioEnabled, setLocalVideoEnabled]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoom.trim() || !inputName.trim()) {
      setError("Please fill in both Room Name and Nickname.");
      return;
    }
    setError(null);
    setRoomInfo(inputRoom.trim(), inputName.trim(), inputRole);
    
    // Stop local preview tracks so they release device locks before LiveKit takes over
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsJoined(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 md:px-0">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 bg-card border border-border/80 rounded-2xl p-6 md:p-10 shadow-2xl shadow-primary/5 backdrop-blur-md">
        
        {/* Left Side: Media Device Preview */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div className="relative aspect-video w-full bg-secondary/60 border border-border rounded-xl overflow-hidden flex items-center justify-center shadow-inner group">
            {localVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center space-y-3 text-muted-foreground">
                <div className="p-4 bg-background/50 rounded-full border border-border">
                  <CameraOff className="w-12 h-12 text-muted-foreground/60" />
                </div>
                <p className="text-sm">Camera is turned off</p>
              </div>
            )}
            
            {/* Quick status badges */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium border border-border/40 flex items-center space-x-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${localVideoEnabled ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span>Camera Setup</span>
            </div>
          </div>

          {/* Quick toggle controls below video */}
          <div className="flex items-center justify-center space-x-4 bg-secondary/35 p-3.5 border border-border/50 rounded-xl">
            <button
              onClick={() => setLocalAudioEnabled(!localAudioEnabled)}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                localAudioEnabled
                  ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "bg-secondary hover:bg-muted border-border text-muted-foreground"
              }`}
              title={localAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
            >
              {localAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setLocalVideoEnabled(!localVideoEnabled)}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                localVideoEnabled
                  ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "bg-secondary hover:bg-muted border-border text-muted-foreground"
              }`}
              title={localVideoEnabled ? "Disable Camera" : "Enable Camera"}
            >
              {localVideoEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Right Side: Configuration & Form */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-primary">
              <Tv className="w-6 h-6 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-bold">LiveKit Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Join Live Stream
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure your nickname, stream room, and join the session.
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Stream Room ID
              </label>
              <input
                type="text"
                placeholder="e.g. game-channel"
                value={inputRoom}
                onChange={(e) => setInputRoom(e.target.value)}
                className="w-full bg-secondary border border-border/80 focus:border-primary/80 focus:ring-1 focus:ring-primary/85 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-muted-foreground/50 text-sm font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Nickname
              </label>
              <input
                type="text"
                placeholder="e.g. StreamerGuy"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-secondary border border-border/80 focus:border-primary/80 focus:ring-1 focus:ring-primary/85 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-muted-foreground/50 text-sm font-medium"
                required
              />
            </div>

            {/* Role selection tab design */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInputRole("host")}
                  className={`flex flex-col items-center justify-center p-3.5 border rounded-xl transition-all duration-200 group text-left ${
                    inputRole === "host"
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                      : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Video className="w-5 h-5 mb-1.5" />
                  <span className="text-sm font-bold">Host</span>
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground/80 mt-0.5 text-center">
                    Can Stream Video & Mic
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputRole("viewer")}
                  className={`flex flex-col items-center justify-center p-3.5 border rounded-xl transition-all duration-200 group text-left ${
                    inputRole === "viewer"
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                      : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Users className="w-5 h-5 mb-1.5" />
                  <span className="text-sm font-bold">Viewer</span>
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground/80 mt-0.5 text-center">
                    Watch & Chat
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-center text-sm flex items-center justify-center space-x-2"
            >
              <span>Enter Stream Lobby</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
