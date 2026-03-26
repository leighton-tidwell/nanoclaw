/**
 * Composite key utilities for Telegram forum topic support.
 *
 * Topics are represented as virtual JIDs: "tg:-100123#5" where 5 is the thread_id.
 * Non-topic messages use the base JID: "tg:-100123".
 * Non-Telegram JIDs are never modified.
 */

const TOPIC_SEPARATOR = '#';

/**
 * Compose a topic-aware JID.
 * Returns the base JID unchanged when threadId is undefined.
 */
export function toTopicJid(
  chatJid: string,
  threadId?: string,
): string {
  if (!threadId) return chatJid;
  return `${chatJid}${TOPIC_SEPARATOR}${threadId}`;
}

/**
 * Decompose a JID into base JID and optional threadId.
 * Non-topic JIDs return threadId as undefined.
 */
export function parseTopicJid(jid: string): {
  baseJid: string;
  threadId: string | undefined;
} {
  const idx = jid.indexOf(TOPIC_SEPARATOR);
  if (idx === -1) return { baseJid: jid, threadId: undefined };
  return {
    baseJid: jid.slice(0, idx),
    threadId: jid.slice(idx + 1),
  };
}

/**
 * Normalize a Telegram message_thread_id.
 *
 * - undefined/null → undefined (non-forum or no topic)
 * - 1 → undefined (General topic — Telegram API quirk where General
 *   sometimes sends thread_id=1 but it's not a real topic)
 * - any other value → string representation
 */
export function normalizeThreadId(
  threadId?: number,
): string | undefined {
  if (threadId == null || threadId === 1) return undefined;
  return threadId.toString();
}
