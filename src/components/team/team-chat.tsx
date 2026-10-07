"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatAdminDate } from "@/lib/admin/format";
import type { TeamChatMessage, TeamRole } from "@/lib/admin/types";
import { cn } from "@/lib/cn";

export function TeamChat({
  initialMessages,
  me,
}: {
  initialMessages: TeamChatMessage[];
  me: { name: string; email: string; role: TeamRole };
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);

  const scrollToEnd = useCallback(() => {
    const root = scroller.current;
    if (!root) return;
    root.scrollTop = root.scrollHeight;
  }, []);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (nearBottom.current) scrollToEnd();
  }, [messages, scrollToEnd]);

  useEffect(() => {
    let cancelled = false;
    async function pull() {
      const response = await fetch("/api/team/chat");
      if (!response.ok || cancelled) return;
      const payload = (await response.json()) as { messages?: TeamChatMessage[] };
      if (!cancelled && payload.messages) setMessages(payload.messages);
    }
    const timer = window.setInterval(pull, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSending(true);
    setError("");
    const response = await fetch("/api/team/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    const payload = (await response.json()) as { error?: string; message?: TeamChatMessage };
    setSending(false);
    if (!response.ok) {
      setError(payload.error ?? "Could not send that message.");
      return;
    }
    if (payload.message) {
      setMessages((current) => [...current, payload.message!]);
      nearBottom.current = true;
    }
    setBody("");
  }

  return (
    <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div
        ref={scroller}
        onScroll={() => {
          const root = scroller.current;
          if (!root) return;
          nearBottom.current = root.scrollHeight - root.scrollTop - root.clientHeight < 80;
        }}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-400">No messages yet. Say hello to the team.</p>
        ) : (
          messages.map((item) => {
            const mine = item.authorEmail === me.email;
            return (
              <article key={item.id} className={cn("max-w-[85%]", mine ? "ml-auto" : "")}>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {item.authorName}
                  <span className="ml-1 font-medium normal-case tracking-normal text-slate-500">
                    · {item.authorRole} · {formatAdminDate(item.createdAt)}
                  </span>
                </p>
                <p
                  className={cn(
                    "whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    mine ? "bg-accent text-on-accent" : "bg-white/10 text-slate-100",
                  )}
                >
                  {item.body}
                </p>
              </article>
            );
          })
        )}
      </div>
      <form onSubmit={send} className="border-t border-white/10 p-3">
        <label className="sr-only" htmlFor="team-chat-body">
          Message the team
        </label>
        <div className="flex gap-2">
          <textarea
            id="team-chat-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Write to the team…"
            className="min-h-12 flex-1 resize-none rounded-xl border border-white/15 bg-[#07111a] px-3 py-2 text-sm text-white outline-none ring-accent/40 placeholder:text-slate-500 focus:ring-2"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="self-end rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] text-on-accent disabled:opacity-50"
          >
            {sending ? "Sending" : "Send"}
          </button>
        </div>
        {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
      </form>
    </section>
  );
}
