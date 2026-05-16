import { Mic, MicOff, VideoOff } from "lucide-react";

function VideoTile({ stream, label, isMuted = false, isLocal = false }) {
  const hasVideo = Boolean(stream?.getVideoTracks?.()?.length);

  return (
    <div className="relative flex min-h-0 overflow-hidden rounded-xl bg-[#2a2a2a]">
      {stream && hasVideo ? (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          ref={(node) => {
            if (!node || !stream) return;
            if (node.srcObject !== stream) node.srcObject = stream;
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white">
            {label?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="text-xs text-slate-400">{label}</span>
        </div>
      )}

      {/* Name + mic indicator */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
        <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          {label}{isLocal ? " (You)" : ""}
        </span>
        {isMuted && (
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-red-600/80">
            <MicOff size={10} className="text-white" />
          </span>
        )}
      </div>

      {/* Camera off indicator */}
      {(!stream || !hasVideo) && (
        <div className="absolute top-2 right-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-black/50">
            <VideoOff size={10} className="text-slate-400" />
          </span>
        </div>
      )}
    </div>
  );
}

export default function ParticipantGrid({
  localStream,
  localLabel,
  localAudioEnabled = true,
  localVideoEnabled = true,
  localScreenStream,
  remoteStreams,
  remoteLabels,
  reactions = [],
}) {
  const remoteEntries = Object.entries(remoteStreams ?? {});

  // Count all tiles to pick the best grid layout
  const hasSreen = Boolean(localScreenStream);
  const participantTiles = [
    localStream ? { id: "local", stream: localStream, label: localLabel || "You", isLocal: true, isMuted: !localAudioEnabled } : null,
    ...remoteEntries.map(([id, stream]) => ({ id, stream, label: remoteLabels?.[id] || `Guest ${id.slice(0, 4)}`, isLocal: false, isMuted: false })),
  ].filter(Boolean);

  const total = participantTiles.length + (hasSreen ? 1 : 0);

  const gridClass =
    total <= 1 ? "grid-cols-1 grid-rows-1" :
    total === 2 ? "grid-cols-2 grid-rows-1" :
    total <= 4 ? "grid-cols-2 grid-rows-2" :
    total <= 6 ? "grid-cols-3 grid-rows-2" :
    "grid-cols-3 grid-rows-3";

  // Floating reactions
  const recentReactions = reactions.slice(-5);

  return (
    <div className="relative h-full w-full bg-[#1c1c1c] p-2">

      {/* Tile grid */}
      <div className={`grid h-full w-full gap-1.5 ${gridClass}`}>
        {hasSreen && (
          <div className={`relative overflow-hidden rounded-xl bg-[#0a0a0a] ${total > 1 ? "col-span-2" : ""}`}>
            <video
              autoPlay playsInline muted
              ref={(node) => {
                if (!node || !localScreenStream) return;
                if (node.srcObject !== localScreenStream) node.srcObject = localScreenStream;
              }}
              className="h-full w-full object-contain"
            />
            <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              📺 {localLabel || "You"} — Screen
            </div>
          </div>
        )}

        {participantTiles.map((tile) => (
          <VideoTile
            key={tile.id}
            stream={tile.stream}
            label={tile.label}
            isLocal={tile.isLocal}
            isMuted={tile.isMuted}
          />
        ))}

        {total === 0 && (
          <div className="flex items-center justify-center text-sm text-slate-600">
            Waiting for camera…
          </div>
        )}
      </div>

      {/* Floating reactions */}
      {recentReactions.length > 0 && (
        <div className="pointer-events-none absolute bottom-16 right-4 flex flex-col items-end gap-1">
          {recentReactions.map((r) => (
            <span key={r.id ?? `${r.sender_id}-${r.created_at}`}
              className="animate-bounce rounded-full bg-black/40 px-2 py-1 text-xl backdrop-blur-sm"
            >{r.emoji}</span>
          ))}
        </div>
      )}
    </div>
  );
}
