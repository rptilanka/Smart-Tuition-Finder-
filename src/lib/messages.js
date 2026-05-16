import { supabase } from "./supabase";

const TABLE = "student_tutor_messages";

export async function sendMessage({ fromUserId, toUserId, fromRole, body }) {
  if (!supabase || !fromUserId || !toUserId || !body?.trim()) throw new Error("Missing required fields.");
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ from_user_id: fromUserId, to_user_id: toUserId, from_role: fromRole, body: body.trim() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getInbox(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, from_user_id, to_user_id, from_role, body, read_at, created_at")
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) return [];
  // Deduplicate into conversations keyed by the other user's id
  const conversations = {};
  (data ?? []).forEach((msg) => {
    const otherId = msg.from_user_id === userId ? msg.to_user_id : msg.from_user_id;
    if (!conversations[otherId]) conversations[otherId] = { otherId, messages: [] };
    conversations[otherId].messages.push(msg);
  });
  return Object.values(conversations);
}

export async function getConversation(userId, otherId) {
  if (!supabase || !userId || !otherId) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, from_user_id, to_user_id, from_role, body, read_at, created_at")
    .or(`and(from_user_id.eq.${userId},to_user_id.eq.${otherId}),and(from_user_id.eq.${otherId},to_user_id.eq.${userId})`)
    .order("created_at", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function markMessagesRead(toUserId, fromUserId) {
  if (!supabase || !toUserId || !fromUserId) return;
  await supabase
    .from(TABLE)
    .update({ read_at: new Date().toISOString() })
    .eq("to_user_id", toUserId)
    .eq("from_user_id", fromUserId)
    .is("read_at", null);
}

export async function getUnreadCount(userId) {
  if (!supabase || !userId) return 0;
  const { count } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("to_user_id", userId)
    .is("read_at", null);
  return count ?? 0;
}
