import { useEffect, useRef, useState } from 'react';
import { SUGGESTED_QUESTIONS } from '@/content/ai-knowledge';

type Msg = { role: 'user' | 'assistant'; content: string };

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Hi — I'm AI Juhi, an assistant trained on Juhi's real work. Ask me about her projects, research, or skills. (I'm an AI, so double-check anything important.)",
};

export function AiJuhiChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, streaming]);

  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) inputRef.current?.focus();
  }, []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next = [...messages, { role: 'user' as const, content: trimmed }];
    setMessages(next);
    setInput('');
    setBusy(true);
    setStreaming('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Drop the canned greeting; send only the real exchange.
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });

      if (!res.ok || !res.body) {
        const errText = (await res.text().catch(() => '')) || 'The assistant is unavailable right now.';
        setMessages((m) => [...m, { role: 'assistant', content: errText }]);
        setStreaming(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setStreaming(acc);
      }
      setMessages((m) => [...m, { role: 'assistant', content: acc || '(no response)' }]);
      setStreaming(null);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "I couldn't reach the server. The live assistant runs on the deployed site — try there, or reach Juhi at jdamley28@cmc.edu.",
        },
      ]);
      setStreaming(null);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <section
      role="dialog"
      aria-label="AI Juhi chat"
      className="fixed z-[80] bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl flex flex-col
        inset-2 md:inset-auto md:bottom-16 md:right-4 md:w-[380px] md:h-[560px] md:max-h-[80vh]"
    >
      {/* Title bar */}
      <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span aria-hidden="true">🤖</span>
          <h2 className="font-bold text-xs md:text-sm tracking-wide truncate">AI Juhi — juhi_ai.exe</h2>
        </div>
        <button
          aria-label="Close chat"
          onClick={onClose}
          className="bg-[#c0c0c0] w-5 h-5 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-red-400 flex items-center justify-center"
        >
          X
        </button>
      </div>

      {/* AI disclaimer */}
      <div className="bg-[#ffffe1] text-[#333] text-[10px] px-2 py-1 border-b border-gray-400 shrink-0">
        ⚠️ AI-generated from Juhi's real writing &amp; projects — may be imperfect.
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto bg-white border-t-2 border-l-2 border-t-gray-500 border-l-gray-500 m-1 p-2 flex flex-col gap-2 text-sm text-black"
      >
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={`inline-block px-2 py-1 rounded max-w-[85%] whitespace-pre-wrap text-left ${
                m.role === 'user' ? 'bg-[#000080] text-white' : 'bg-[#e4e4e4] text-black'
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {streaming !== null && (
          <div className="text-left">
            <span className="inline-block px-2 py-1 rounded max-w-[85%] whitespace-pre-wrap bg-[#e4e4e4] text-black">
              {streaming || '…'}
            </span>
          </div>
        )}
      </div>

      {/* Suggested questions (only before the first user turn) */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-1 px-2 pb-1 shrink-0">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-[11px] bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-b-black border-r-black px-2 py-0.5 text-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-[#d4d4d4]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-1 p-1 shrink-0"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          aria-label="Ask AI Juhi a question"
          placeholder={busy ? 'Thinking…' : 'Ask about Juhi…'}
          className="flex-1 bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white px-2 py-1 text-sm text-black focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 font-bold text-sm text-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
