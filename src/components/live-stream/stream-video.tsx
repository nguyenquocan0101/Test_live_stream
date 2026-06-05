"use client";

import React from "react";
import { useTracks, VideoTrack, AudioTrack, TrackReference } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Radio, MicOff, CameraOff } from "lucide-react";

export default function StreamVideo() {
  // Fetch camera and screen share tracks from all room participants
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false }
    ],
    { onlySubscribed: false }
  );

  // Use tracks directly (useTracks already returns correct references)
  const activeTracks = tracks;

  if (activeTracks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-secondary/10 p-8 min-h-[50vh]">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 animate-live-pulse">
            <Radio className="w-8 h-8 text-primary" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">Waiting for Host</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
          The room is active. Once the host starts sharing their camera or screen, the stream will appear here automatically.
        </p>
      </div>
    );
  }

  // Define responsive grid columns
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="flex-1 bg-black/40 p-4 flex items-center justify-center min-h-[50vh]">
      <div className={`grid w-full h-full max-w-7xl gap-4 ${getGridClass(activeTracks.length)}`}>
        {activeTracks.map((trackReference) => {
          const participant = trackReference.participant;
          const isLocal = participant.isLocal;
          const isSpeaking = participant.isSpeaking;
          const audioTrackPub = participant.getTrackPublication(Track.Source.Microphone);
          const isMuted = !audioTrackPub || audioTrackPub.isMuted;
          const isLocalCamera = isLocal && trackReference.source === Track.Source.Camera;

          return (
            <div
              key={`${participant.identity}-${trackReference.source}`}
              className={`relative aspect-video bg-secondary/40 rounded-xl overflow-hidden border transition-all duration-300 ${
                isSpeaking 
                  ? "border-primary ring-2 ring-primary/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                  : "border-border"
              }`}
            >
              {/* Actual video track rendering or camera off placeholder */}
              {trackReference.publication ? (
                <VideoTrack
                  trackRef={trackReference as TrackReference}
                  className={`w-full h-full object-cover ${isLocalCamera ? "scale-x-[-1]" : ""}`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/30 text-muted-foreground space-y-3">
                  <div className="p-4 bg-background/50 rounded-full border border-border">
                    <CameraOff className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Camera Off</span>
                </div>
              )}

              {/* Mount audio track element to hear other participants */}
              {trackReference.source === Track.Source.Camera && !isLocal && audioTrackPub && (
                <AudioTrack
                  trackRef={{
                    participant,
                    source: Track.Source.Microphone,
                    publication: audioTrackPub,
                  } as TrackReference}
                />
              )}

              {/* Overlay with participant information */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-border/40 flex items-center space-x-1.5 text-white">
                  <span>{participant.name || participant.identity}</span>
                  {isLocal && (
                    <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded font-bold">
                      You
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {isMuted && (
                    <div className="bg-destructive/90 backdrop-blur-md p-1.5 rounded-lg border border-destructive/20 text-white">
                      <MicOff className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {isSpeaking && (
                    <div className="bg-green-500/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold border border-green-500/20 text-white flex items-center space-x-1 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Speaking</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
