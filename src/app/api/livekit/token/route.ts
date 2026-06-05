import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const { roomName, participantName, role } = await req.json();

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: "Missing roomName or participantName" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        {
          error: "LiveKit server credentials are not configured in environment variables. Please set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and NEXT_PUBLIC_LIVEKIT_WS_URL or LIVEKIT_URL in your .env.local file."
        },
        { status: 500 }
      );
    }

    // Create the AccessToken with 2-hour duration
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
      ttl: "2h",
    });

    const isHost = role === "host";

    // Set permission grants for the token
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isHost,      // Only hosts can publish audio/video by default
      canSubscribe: true,      // Everyone can subscribe to audio/video
      canPublishData: true,    // Everyone can publish data channel packets (chat/metadata)
    });

    // Generate token JWT
    const token = await at.toJwt();

    return NextResponse.json({
      token,
      serverUrl: wsUrl,
    });
  } catch (error: any) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
