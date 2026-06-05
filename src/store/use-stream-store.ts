import { create } from "zustand";

interface StreamState {
  roomName: string;
  participantName: string;
  role: "host" | "viewer";
  isJoined: boolean;
  isChatOpen: boolean;
  localVideoEnabled: boolean;
  localAudioEnabled: boolean;
  
  setRoomInfo: (roomName: string, participantName: string, role: "host" | "viewer") => void;
  setIsJoined: (isJoined: boolean) => void;
  toggleChat: () => void;
  setChatOpen: (isOpen: boolean) => void;
  setLocalVideoEnabled: (enabled: boolean) => void;
  setLocalAudioEnabled: (enabled: boolean) => void;
  reset: () => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  roomName: "",
  participantName: "",
  role: "viewer",
  isJoined: false,
  isChatOpen: true,
  localVideoEnabled: true,
  localAudioEnabled: true,

  setRoomInfo: (roomName, participantName, role) => set({ roomName, participantName, role }),
  setIsJoined: (isJoined) => set({ isJoined }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  setLocalVideoEnabled: (enabled) => set({ localVideoEnabled: enabled }),
  setLocalAudioEnabled: (enabled) => set({ localAudioEnabled: enabled }),
  reset: () => set({
    roomName: "",
    participantName: "",
    role: "viewer",
    isJoined: false,
    isChatOpen: true,
    localVideoEnabled: true,
    localAudioEnabled: true,
  }),
}));
