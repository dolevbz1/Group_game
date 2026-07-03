import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import './AIBot.css';

type Role = 'user' | 'bot';
type Message = { id: number; role: Role; text: string; typing?: boolean };

type Suggestion = { emoji: string; text: string };

const SUGGESTIONS: Suggestion[] = [
  { emoji: '🏊', text: 'מתי שעות הפתיחה של הבריכה?' },
  { emoji: '📅', text: 'אילו אירועים מתוכננים השבוע?' },
  { emoji: '🤝', text: 'איך אפשר להתנדב בקהילה?' },
];

const REPLIES: { match: string; text: string }[] = [
  {
    match: 'בריכה',
    text: 'הבריכה פתוחה היום בין 06:00 ל-21:00, ובסופי שבוע עד 19:00. רוצה שאזכיר לך לפני הסגירה?',
  },
  {
    match: 'אירוע',
    text: 'השבוע מתוכננים שלושה אירועים: ערב הורים ביום שלישי, שוק קהילתי ביום שישי והרצאה ביום ראשון. שאפתח לך אחד מהם לפרטים?',
  },
  {
    match: 'התנדב',
    text: 'יש כמה התנדבויות פעילות — ליווי קשישים, הגינה הקהילתית ושמירת שכונה. רוצה שארשום אותך לאחת מהן?',
  },
];

const FALLBACK =
  'שאלה מצוינת! אני אוסף את המידע הרלוונטי מהקהילה ואחזור אליך עם תשובה תוך רגע.';

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 5 5 12 12 19" />
    </svg>
  );
}

function SuggestionChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

type AIBotProps = {
  open: boolean;
  startRect: DOMRect | null;
  onClose: () => void;
  initialMessage?: string;
};

export default function AIBot({ open, startRect, onClose, initialMessage }: AIBotProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const started = messages.length > 0;

  const inputRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const nextId = () => (idRef.current += 1);

  // Mount / unmount with a leaving animation
  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      return;
    }
    if (!render) return;
    setVisible(false);
    setClosing(true);
    const t = setTimeout(() => {
      setRender(false);
      setClosing(false);
      setMessages([]);
      setInput('');
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // FLIP: slide the input bar back up to the header position (animated on close)
  const flipInput = () => {
    const el = inputRef.current;
    if (!el || !startRect) return;
    const last = el.getBoundingClientRect();
    const dy = startRect.top - last.top;
    el.style.transition = '';
    el.style.transform = `translateY(${dy}px)`;
  };

  useLayoutEffect(() => {
    if (!render) return;
    const el = inputRef.current;
    if (el && startRect) {
      const last = el.getBoundingClientRect();
      const dy = startRect.top - last.top;
      el.style.transition = 'none';
      el.style.transform = `translateY(${dy}px)`;
      void el.offsetHeight; // force reflow
      el.style.transition = '';
      el.style.transform = '';
    }
    const raf = requestAnimationFrame(() => {
      setVisible(true);
      if (initialMessage) {
        setTimeout(() => send(initialMessage), 300);
      }
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  // Escape closes
  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onClose]);

  // Keep the conversation scrolled to the latest message
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    setMessages((m) => [...m, { id: nextId(), role: 'user', text }]);
    setInput('');

    const typingId = nextId();
    const typingTimer = setTimeout(() => {
      setMessages((m) => [...m, { id: typingId, role: 'bot', text: '', typing: true }]);
    }, 350);

    const reply = REPLIES.find((r) => text.includes(r.match))?.text ?? FALLBACK;
    const replyTimer = setTimeout(() => {
      setMessages((m) =>
        m.map((x) => (x.id === typingId ? { ...x, typing: false, text: reply } : x))
      );
    }, 1700);

    void typingTimer;
    void replyTimer;
  };

  if (!render) return null;

  return (
    <div className={`aibot${visible ? ' is-open' : ''}${closing ? ' is-closing' : ''}`} role="dialog" aria-label="עוזר חכם" dir="rtl">
      <div className="aibot-bg" />

      <div className="aibot-top">
        <button type="button" className="aibot-back" onClick={onClose} aria-label="סגירה">
          <CloseIcon />
        </button>
        <div className="aibot-id">
          <span className="aibot-id-dot" aria-hidden="true" />
          <span className="text-small-bold">העוזר של גבעת אלה</span>
        </div>
        <span className="aibot-top-spacer" aria-hidden="true" />
      </div>

      <div className="aibot-shell" ref={listRef}>
        {!started ? (
          <div className="aibot-welcome">
            <div className="aibot-avatar" aria-hidden="true">
              <svg className="aibot-avatar-sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 12.8 7.2 14.5 9.5C16.8 11.2 22 12 22 12C22 12 16.8 12.8 14.5 15.1C12.8 16.8 12 22 12 22C12 22 11.2 16.8 9.5 15.1C7.2 12.8 2 12 2 12C2 12 7.2 11.2 9.5 9.5C11.2 7.2 12 2 12 2Z" fill="#1a1a1a"/>
                <path d="M19 2C19 2 19.4 4.6 20.25 5.75C21.4 6.6 24 7 24 7C24 7 21.4 7.4 20.25 8.55C19.4 9.4 19 12 19 12C19 12 18.6 9.4 17.75 8.55C16.6 7.4 14 7 14 7C14 7 16.6 6.6 17.75 5.75C18.6 4.6 19 2 19 2Z" fill="#1a1a1a"/>
              </svg>
            </div>
            <h1 className="aibot-greeting text-h2-normal">
              היי טל,
              <br />
              <span className="aibot-greeting-rainbow">מה בא לך לדעת היום?</span>
            </h1>

            <div className="aibot-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  className="aibot-suggestion"
                  onClick={() => send(s.text)}
                >
                  <span className="aibot-suggestion-emoji" aria-hidden="true">{s.emoji}</span>
                  <span className="aibot-suggestion-text text-small-normal">{s.text}</span>
                  <span className="aibot-suggestion-arrow" aria-hidden="true">
                    <SuggestionChevron />
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="aibot-conversation">
            {messages.map((m) =>
              m.role === 'bot' ? (
                <div key={m.id} className="aibot-msg aibot-msg-bot">
                  <span className="aibot-msg-avatar" aria-hidden="true">
                    <svg className="aibot-msg-avatar-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C12 2 12.8 7.2 14.5 9.5C16.8 11.2 22 12 22 12C22 12 16.8 12.8 14.5 15.1C12.8 16.8 12 22 12 22C12 22 11.2 16.8 9.5 15.1C7.2 12.8 2 12 2 12C2 12 7.2 11.2 9.5 9.5C11.2 7.2 12 2 12 2Z" fill="#1a1a1a"/>
                      <path d="M19 2C19 2 19.4 4.6 20.25 5.75C21.4 6.6 24 7 24 7C24 7 21.4 7.4 20.25 8.55C19.4 9.4 19 12 19 12C19 12 18.6 9.4 17.75 8.55C16.6 7.4 14 7 14 7C14 7 16.6 6.6 17.75 5.75C18.6 4.6 19 2 19 2Z" fill="#1a1a1a"/>
                    </svg>
                  </span>
                  {m.typing ? (
                    <span className="aibot-thinking text-small-normal" aria-label="חושב">
                      רגע אני על זה...
                    </span>
                  ) : (
                    <div className="aibot-bubble aibot-bubble-bot">
                      <span className="text-medium-normal">{m.text}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div key={m.id} className="aibot-msg aibot-msg-user">
                  <div className="aibot-bubble aibot-bubble-user">
                    <span className="text-medium-normal">{m.text}</span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="aibot-input" ref={inputRef}>
        <form
          className="aibot-input-card"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            className="aibot-input-field text-medium-normal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="שאל אותי כל דבר על הקהילה..."
            aria-label="הקלדת הודעה"
          />
          <button
            type="submit"
            className="aibot-send"
            aria-label="שליחה"
            disabled={!input.trim()}
          >
            <SendArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
