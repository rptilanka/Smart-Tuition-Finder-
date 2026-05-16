import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Loader2,
  Lock,
  Mic,
  MicOff,
  MonitorUp,
  MonitorX,
  Square,
  UserMinus,
  Users,
  Video,
  X,
} from "lucide-react";

import LiveChatPanel from "./LiveChatPanel";
import ParticipantGrid from "./ParticipantGrid";
import PollsQaPanel from "./PollsQaPanel";
import RaiseHandPanel from "./RaiseHandPanel";
import {
  askQuestion,
  closePoll,
  createPoll,
  decideWaitingRequest,
  heartbeatParticipant,
  joinMeeting,
  leaveMeeting,
  listChatMessages,
  listPollVotes,
  listPolls,
  listParticipants,
  listQuestions,
  listRecentReactions,
  listWaitingRoom,
  markQuestionAnswered,
  muteAllParticipants,
  removeParticipant,
  sendReaction,
  sendChatMessage,
  setMeetingLock,
  setMeetingWaitingRoom,
  setParticipantMuted,
  setRaisedHand,
  votePoll,
} from "../../lib/liveMeetings";
import { fetchProviderJoinToken } from "../../lib/liveProviderAdapter";
import {
  buildRtcConfig,
  closeSignalingChannel,
  createSignalingChannel,
  sendSignal,
} from "../../lib/webrtcSignaling";
import { useAuth } from "../../context/AuthContext";
import DailyLiveCall from "./DailyLiveCall";

function ensurePeerConnection({ peerId, peersRef, localStream, onRemoteStream, onIce }) {
  let pc = peersRef.current[peerId];
  if (pc) return pc;
  pc = new RTCPeerConnection(buildRtcConfig());
  peersRef.current[peerId] = pc;
  if (localStream) localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
  pc.onicecandidate = (e) => { if (e.candidate) onIce(peerId, e.candidate); };
  pc.ontrack = (e) => { const s = e.streams?.[0]; if (s) onRemoteStream(peerId, s); };
  pc.onconnectionstatechange = () => {
    const st = pc.connectionState;
    if (st === "failed" || st === "closed" || st === "disconnected") {
      pc.close();
      delete peersRef.current[peerId];
      onRemoteStream(peerId, null);
    }
  };
  return pc;
}

export default function LiveRoom({
  meetingId, currentUser, role, meetingTitle, passcode = "", joinToken = "", meeting, onMeetingUpdated, onEnd,
}) {
  const [joining, setJoining] = useState(true);
  const [error, setError] = useState("");
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [pollVotesByPollId, setPollVotesByPollId] = useState({});
  const [questions, setQuestions] = useState([]);
  const [waitingRequests, setWaitingRequests] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [screenStream, setScreenStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [handRaised, setHandRaisedState] = useState(false);
  const [providerInfo, setProviderInfo] = useState({ provider: "mesh", token: "" });
  const [dailySession, setDailySession] = useState(null);
  const [sidebarTab, setSidebarTab] = useState(null); // null | "chat" | "people" | "tools"

  const { session } = useAuth();
  const peersRef = useRef({});
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const signalingRef = useRef(null);
  const pollRef = useRef(null);
  const heartbeatRef = useRef(null);

  const userId = currentUser?.id;
  const localLabel = useMemo(
    () => currentUser?.user_metadata?.name || currentUser?.email || "You",
    [currentUser],
  );

  useEffect(() => {
    let disposed = false;

    async function refreshRoomMeta() {
      const [pRows, chatRows, reactionRows, pollRows, questionRows, waitingRows] = await Promise.all([
        listParticipants(meetingId),
        listChatMessages(meetingId),
        listRecentReactions(meetingId),
        listPolls(meetingId),
        listQuestions(meetingId),
        role === "tutor" ? listWaitingRoom(meetingId) : Promise.resolve([]),
      ]);
      if (disposed) return;
      setParticipants(pRows);
      setMessages(chatRows);
      setReactions(reactionRows);
      setPolls(pollRows);
      setQuestions(questionRows);
      setWaitingRequests(waitingRows);
      const votesEntries = await Promise.all(
        (pollRows ?? []).map(async (poll) => [poll.id, await listPollVotes(poll.id)]),
      );
      const byPoll = {};
      votesEntries.forEach(([pollId, rows]) => {
        const map = {};
        (rows ?? []).forEach((v) => { map[v.option_index] = (map[v.option_index] ?? 0) + 1; });
        byPoll[pollId] = map;
      });
      setPollVotesByPollId(byPoll);
      const me = pRows.find((p) => p.user_id === userId);
      setHandRaisedState(Boolean(me?.hand_raised));
      const audioTrack = localStreamRef.current?.getAudioTracks?.()?.[0];
      if (audioTrack && me?.is_muted && audioTrack.enabled) {
        audioTrack.enabled = false;
        setLocalAudioEnabled(false);
      }
      if (me?.is_removed) setError("You were removed by the host.");
    }

    async function start() {
      if (!meetingId || !userId || !role) {
        setError("Missing meeting join parameters.");
        setJoining(false);
        return;
      }
      try {
        const provider = await fetchProviderJoinToken({
          meetingId, userId, role, passcode, joinToken,
          accessToken: session?.access_token ?? "",
          userName: localLabel,
        });
        setProviderInfo(provider);
        const roomUrl = provider.metadata?.roomUrl || "";
        const isDaily = String(provider.provider || "").toLowerCase() === "daily" && Boolean(provider.token) && Boolean(roomUrl);

        if (isDaily) {
          await joinMeeting({ meetingId, userId, role, passcode, joinToken });
          await refreshRoomMeta();
          setDailySession({ roomUrl, token: provider.token });
          pollRef.current = window.setInterval(() => refreshRoomMeta().catch(console.warn), 4000);
          heartbeatRef.current = window.setInterval(() => heartbeatParticipant({ meetingId, userId }).catch(console.warn), 10000);
          return;
        }

        setDailySession(null);
        await joinMeeting({ meetingId, userId, role, passcode, joinToken });
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (disposed) { stream.getTracks().forEach((t) => t.stop()); return; }
        localStreamRef.current = stream;
        setLocalStream(stream);
        await refreshRoomMeta();

        const channel = createSignalingChannel({
          meetingId, userId,
          onPresenceSync: async (peerIds) => {
            for (const peerId of peerIds) {
              const pc = ensurePeerConnection({
                peerId, peersRef, localStream: stream,
                onRemoteStream: (id, rs) => setRemoteStreams((prev) => {
                  if (!rs) { const n = { ...prev }; delete n[id]; return n; }
                  return { ...prev, [id]: rs };
                }),
                onIce: (toPeerId, candidate) => sendSignal(channel, { from: userId, to: toPeerId, type: "ice-candidate", candidate }),
              });
              if (String(userId) > String(peerId) && pc.signalingState === "stable") {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                await sendSignal(channel, { from: userId, to: peerId, type: "offer", sdp: offer });
              }
            }
            setRemoteStreams((prev) => {
              const n = { ...prev };
              Object.keys(n).forEach((id) => {
                if (!peerIds.includes(id)) {
                  delete n[id];
                  peersRef.current[id]?.close();
                  delete peersRef.current[id];
                }
              });
              return n;
            });
          },
          onSignal: async (payload) => {
            const pc = ensurePeerConnection({
              peerId: payload.from, peersRef, localStream: stream,
              onRemoteStream: (id, rs) => setRemoteStreams((prev) => {
                if (!rs) { const n = { ...prev }; delete n[id]; return n; }
                return { ...prev, [id]: rs };
              }),
              onIce: (toPeerId, candidate) => sendSignal(channel, { from: userId, to: toPeerId, type: "ice-candidate", candidate }),
            });
            if (payload.type === "offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await sendSignal(channel, { from: userId, to: payload.from, type: "answer", sdp: answer });
            } else if (payload.type === "answer") {
              await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
            } else if (payload.type === "ice-candidate" && payload.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
            }
          },
          onError: (e) => setError(e.message || "Realtime connection error."),
        });
        signalingRef.current = channel;
        pollRef.current = window.setInterval(() => refreshRoomMeta().catch(console.warn), 4000);
        heartbeatRef.current = window.setInterval(() => heartbeatParticipant({ meetingId, userId }).catch(console.warn), 10000);
      } catch (e) {
        setError(e?.message || "Failed to join live room.");
      } finally {
        if (!disposed) setJoining(false);
      }
    }

    start();

    return () => {
      disposed = true;
      if (pollRef.current) window.clearInterval(pollRef.current);
      if (heartbeatRef.current) window.clearInterval(heartbeatRef.current);
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      if (signalingRef.current) { closeSignalingChannel(signalingRef.current); signalingRef.current = null; }
      if (meetingId && userId) leaveMeeting({ meetingId, userId }).catch(() => undefined);
      setDailySession(null);
    };
  }, [meetingId, userId, role, passcode, joinToken, session?.access_token, localLabel]);

  const toggleLocalAudio = () => {
    const track = localStreamRef.current?.getAudioTracks?.()?.[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setLocalAudioEnabled(track.enabled);
  };

  const toggleLocalVideo = () => {
    const track = localStreamRef.current?.getVideoTracks?.()?.[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setLocalVideoEnabled(track.enabled);
  };

  const replaceVideoTrackForPeers = (newTrack) => {
    Object.values(peersRef.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) sender.replaceTrack(newTrack);
    });
  };

  const stopScreenShare = () => {
    if (!screenStreamRef.current) return;
    const track = localStreamRef.current?.getVideoTracks?.()?.[0] ?? null;
    replaceVideoTrackForPeers(track);
    screenStreamRef.current.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setScreenStream(null);
  };

  const toggleScreenShare = async () => {
    if (screenStreamRef.current) { stopScreenShare(); return; }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStreamRef.current = stream;
      setScreenStream(stream);
      const track = stream.getVideoTracks?.()?.[0];
      if (track) { replaceVideoTrackForPeers(track); track.onended = () => stopScreenShare(); }
    } catch (e) {
      setError(e.message || "Screen share permission denied.");
    }
  };

  /* ── loading / error states ── */
  if (joining) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
        <Loader2 size={22} className="animate-spin" />
        <p className="text-sm">Joining live class…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
        {error}
      </div>
    );
  }

  const remoteCount = Object.keys(remoteStreams).length;

  const sidebarOpen = sidebarTab !== null;

  return (
    <div className="relative flex flex-1 min-h-0 w-full overflow-hidden bg-[#1c1c1c]">

      {/* ── Video canvas — always fills full space ── */}
      <div className="flex flex-1 min-w-0 flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">
          {dailySession ? (
            <DailyLiveCall roomUrl={dailySession.roomUrl} token={dailySession.token} />
          ) : (
            <ParticipantGrid
              localStream={localStream}
              localLabel={localLabel}
              localAudioEnabled={localAudioEnabled}
              localVideoEnabled={localVideoEnabled}
              localScreenStream={screenStream}
              remoteStreams={remoteStreams}
              remoteLabels={{}}
              reactions={reactions}
            />
          )}
        </div>

        {/* ── Zoom-style floating controls bar ── */}
        {!dailySession && (
          <div className="shrink-0 flex items-center justify-between gap-2 border-t border-white/10 bg-[#242424] px-6 py-2.5">

            {/* Left group: mic, camera, share */}
            <div className="flex items-center gap-1">
              <ZoomBtn
                onClick={toggleLocalAudio}
                active={localAudioEnabled}
                activeIcon={<Mic size={18} />}
                inactiveIcon={<MicOff size={18} />}
                label={localAudioEnabled ? "Mute" : "Unmute"}
                danger={!localAudioEnabled}
              />
              <ZoomBtn
                onClick={toggleLocalVideo}
                active={localVideoEnabled}
                activeIcon={<Camera size={18} />}
                inactiveIcon={<CameraOff size={18} />}
                label={localVideoEnabled ? "Stop video" : "Start video"}
                danger={!localVideoEnabled}
              />
              <ZoomBtn
                onClick={toggleScreenShare}
                active={!screenStream}
                activeIcon={<MonitorUp size={18} />}
                inactiveIcon={<MonitorX size={18} />}
                label={screenStream ? "Stop share" : "Share screen"}
              />
            </div>

            {/* Center group: participants, chat, tools, reactions */}
            <div className="flex items-center gap-1">
              <ZoomBtn
                onClick={() => setSidebarTab(sidebarTab === "people" ? null : "people")}
                active={sidebarTab !== "people"}
                activeIcon={<Users size={18} />}
                inactiveIcon={<Users size={18} />}
                label={`Participants (${participants.length})`}
                highlighted={sidebarTab === "people"}
              />
              <ZoomBtn
                onClick={() => setSidebarTab(sidebarTab === "chat" ? null : "chat")}
                active={sidebarTab !== "chat"}
                activeIcon={<MessageIcon />}
                inactiveIcon={<MessageIcon />}
                label="Chat"
                highlighted={sidebarTab === "chat"}
              />
              <ZoomBtn
                onClick={() => setSidebarTab(sidebarTab === "tools" ? null : "tools")}
                active={sidebarTab !== "tools"}
                activeIcon={<AppsIcon />}
                inactiveIcon={<AppsIcon />}
                label="More"
                highlighted={sidebarTab === "tools"}
              />
              <div className="mx-1 h-8 w-px bg-white/10" />
              {["👍", "👏", "🔥", "🎉", "❤️"].map((emoji) => (
                <button key={emoji} type="button"
                  onClick={() => sendReaction({ meetingId, senderId: userId, emoji }).catch(() => {})}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg transition hover:bg-white/10"
                >{emoji}</button>
              ))}
            </div>

            {/* Right group: end call */}
            <div className="flex items-center">
              {role === "tutor" && (
                <button type="button" onClick={onEnd}
                  className="flex flex-col items-center gap-0.5 rounded-xl bg-red-600 px-5 py-2 text-[11px] font-semibold text-white transition hover:bg-red-500"
                >
                  <Square size={18} />
                  <span>End</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Sidebar panel — slides in from right ── */}
      {sidebarOpen && (
        <div className="flex w-80 shrink-0 flex-col border-l border-white/10 bg-[#2d2d2d]">

          {/* Sidebar header */}
          <div className="shrink-0 flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex gap-1">
              {[
                { key: "chat", label: "Chat" },
                { key: "people", label: `People (${participants.length})` },
                { key: "tools", label: "More" },
              ].map((tab) => (
                <button key={tab.key} type="button" onClick={() => setSidebarTab(tab.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    sidebarTab === tab.key
                      ? "bg-white/15 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >{tab.label}</button>
              ))}
            </div>
            <button type="button" onClick={() => setSidebarTab(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            ><X size={14} /></button>
          </div>

          {/* Sidebar body */}
          <div className="flex-1 min-h-0 overflow-y-auto">

            {sidebarTab === "chat" && (
              <ZoomChatPanel
                messages={messages}
                currentUserId={userId}
                onSend={async (body) => {
                  const saved = await sendChatMessage({ meetingId, senderId: userId, body });
                  if (saved) setMessages((prev) => [...prev, saved]);
                }}
              />
            )}

            {sidebarTab === "people" && (
              <div className="p-4 space-y-4">
                {waitingRequests.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Waiting</p>
                    <ul className="space-y-1">
                      {waitingRequests.map((req) => (
                        <li key={req.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2">
                          <span className="text-xs text-slate-300">{req.user_id.slice(0, 8)}…</span>
                          <div className="flex gap-1">
                            <button type="button"
                              onClick={() => decideWaitingRequest({ requestId: req.id, meetingId, tutorId: userId, decision: "approved" }).catch(() => {})}
                              className="rounded-md bg-green-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-green-500"
                            >Admit</button>
                            <button type="button"
                              onClick={() => decideWaitingRequest({ requestId: req.id, meetingId, tutorId: userId, decision: "denied" }).catch(() => {})}
                              className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold text-slate-300"
                            >Deny</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {role === "tutor" && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button"
                      onClick={async () => { const u = await setMeetingLock({ meetingId, tutorId: userId, locked: !meeting?.is_locked }); onMeetingUpdated?.(u); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-white/10"
                    ><Lock size={11} />{meeting?.is_locked ? "Unlock" : "Lock room"}</button>
                    <button type="button"
                      onClick={() => muteAllParticipants({ meetingId, actorId: userId }).catch(() => {})}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-white/10"
                    ><MicOff size={11} /> Mute all</button>
                  </div>
                )}

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">In the room</p>
                  <ul className="space-y-1">
                    {participants.map((p) => (
                      <li key={p.user_id} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                            {p.user_id[0]?.toUpperCase()}
                          </div>
                          <span className="text-xs text-slate-200">
                            {p.user_id === userId ? "You (host)" : p.user_id.slice(0, 10) + "…"}
                          </span>
                          {p.is_muted && <MicOff size={10} className="text-slate-500" />}
                          {p.hand_raised && <span className="text-xs">✋</span>}
                        </div>
                        {role === "tutor" && p.user_id !== userId && (
                          <div className="flex gap-1">
                            <button type="button"
                              onClick={() => setParticipantMuted({ meetingId, actorId: userId, participantUserId: p.user_id, muted: !p.is_muted }).catch(() => {})}
                              className="rounded px-2 py-0.5 text-[10px] font-semibold text-slate-400 hover:bg-white/10 hover:text-white"
                            >{p.is_muted ? "Unmute" : "Mute"}</button>
                            <button type="button"
                              onClick={() => removeParticipant({ meetingId, actorId: userId, participantUserId: p.user_id }).catch(() => {})}
                              className="rounded px-2 py-0.5 text-[10px] font-semibold text-red-400 hover:bg-red-500/10"
                            ><UserMinus size={10} /></button>
                          </div>
                        )}
                      </li>
                    ))}
                    {participants.length === 0 && (
                      <li className="text-xs text-slate-500">No one else is here yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {sidebarTab === "tools" && (
              <div className="p-4 space-y-3">
                <RaiseHandPanel
                  participants={participants}
                  currentUserId={userId}
                  handRaised={handRaised}
                  onToggleHand={async () => {
                    const next = !handRaised;
                    await setRaisedHand({ meetingId, userId, handRaised: next });
                    setHandRaisedState(next);
                  }}
                />
                <PollsQaPanel
                  role={role}
                  polls={polls}
                  pollVotesByPollId={pollVotesByPollId}
                  questions={questions}
                  onCreatePoll={async (question, options) => createPoll({ meetingId, creatorId: userId, question, options })}
                  onVotePoll={async (pollId, optionIndex) => votePoll({ pollId, meetingId, voterId: userId, optionIndex })}
                  onClosePoll={async (pollId) => closePoll({ pollId, meetingId, actorId: userId })}
                  onAskQuestion={async (body) => askQuestion({ meetingId, senderId: userId, body })}
                  onToggleQuestionAnswered={async (questionId, answered) => markQuestionAnswered({ questionId, meetingId, answered })}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Zoom-style control button ──────────────────────────────────────────── */
function ZoomBtn({ onClick, active, activeIcon, inactiveIcon, label, danger = false, highlighted = false }) {
  return (
    <button type="button" onClick={onClick} title={label}
      className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-medium transition min-w-[56px] ${
        highlighted
          ? "bg-white/20 text-white"
          : danger
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {active ? activeIcon : inactiveIcon}
      <span className="mt-0.5 whitespace-nowrap">{label}</span>
    </button>
  );
}

/* ── Inline SVG icons ───────────────────────────────────────────────────── */
function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function AppsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" /><circle cx="16" cy="8" r="2" /><circle cx="8" cy="16" r="2" /><circle cx="16" cy="16" r="2" />
    </svg>
  );
}

/* ── Dark chat panel for sidebar ────────────────────────────────────────── */
function ZoomChatPanel({ messages, currentUserId, onSend }) {
  const [text, setText] = useState("");
  const sorted = [...(messages ?? [])].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
        {sorted.length === 0 && (
          <p className="text-xs text-slate-500 text-center pt-8">No messages yet</p>
        )}
        {sorted.map((item) => {
          const mine = item.sender_id === currentUserId;
          return (
            <div key={item.id ?? `${item.sender_id}-${item.created_at}`}
              className={`rounded-xl px-3 py-2 text-xs max-w-[85%] ${mine ? "ml-auto bg-blue-600 text-white" : "bg-white/10 text-slate-200"}`}
            >
              <p className="break-words">{item.body}</p>
              <p className={`mt-1 text-[10px] ${mine ? "text-blue-200" : "text-slate-500"}`}>
                {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
              </p>
            </div>
          );
        })}
      </div>
      <form className="shrink-0 border-t border-white/10 p-3 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (!t) return; onSend?.(t); setText(""); }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Send a message…"
          className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-white/20"
        />
        <button type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
