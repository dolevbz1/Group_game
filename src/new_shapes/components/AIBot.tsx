import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import eventsGarlandsAnimation from '../assets/ai-events-garlands.json';
import poolSwimmerAnimation from '../assets/ai-pool-swimmer.json';
import swimmingAnimation from '../assets/swimming.json';
import automationToggleAnimation from '../assets/toggle.json';
import volunteerHeartAnimation from '../assets/ai-volunteer-heart.json';
import {
  AUTOMATION_TEMPLATES,
  type AutomationTemplate,
} from '../data/automationTemplates';
import { EVENTS_BY_DATE } from '../data/eventsData';
import { getNewsById } from '../data/newsItems';
import { VOLUNTEER_REQUESTS } from '../data/volunteerRequests';
import './AIBot.css';

type Role = 'user' | 'bot';
type MessageVariant =
  | 'automation-options'
  | 'automation-review'
  | 'event-options'
  | 'pool-update'
  | 'volunteer-options';
type Message = {
  id: number;
  role: Role;
  text: string;
  typing?: boolean;
  variant?: MessageVariant;
  automation?: AutomationTemplate;
};

type Suggestion = { emoji?: string; animation?: object; text: string };
type Reply = {
  match: string;
  text: string;
  variant?: MessageVariant;
  automation?: AutomationTemplate;
};
type CustomAutomationDraft = {
  stage: 'trigger' | 'action';
  trigger?: string;
};

const UPCOMING_EVENTS = Object.entries(EVENTS_BY_DATE)
  .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
  .flatMap(([date, events]) => events.map((event) => ({ ...event, date })));
const POOL_UPDATE = getNewsById('pool');
const MARKETPLACE_FREE_AUTOMATION = AUTOMATION_TEMPLATES.find(
  (template) => template.id === 'marketplace-free-item'
);

const SUGGESTIONS: Suggestion[] = [
  { animation: poolSwimmerAnimation, text: 'מתי שעות הפתיחה של הבריכה?' },
  { animation: eventsGarlandsAnimation, text: 'אילו אירועים מתוכננים השבוע?' },
  { animation: volunteerHeartAnimation, text: 'איך אפשר להתנדב בקהילה?' },
  { animation: automationToggleAnimation, text: 'ליצור אוטומציה אישית' },
];

const REPLIES: Reply[] = [
  {
    match: 'בריכה',
    text: 'מצאתי את העדכון האחרון מצוות הבריכה עם שעות הפעילות לקיץ:',
    variant: 'pool-update',
  },
  {
    match: 'אירוע',
    text: `מצאתי ${UPCOMING_EVENTS.length} אירועים קרובים השבוע. הנה האירועים והפרטים החשובים:`,
    variant: 'event-options',
  },
  {
    match: 'התנדב',
    text: 'מצאתי 4 אפשרויות התנדבות שמתאימות לזמן הפנוי ביומן שלך:',
    variant: 'volunteer-options',
  },
  {
    match: 'אוטומצ',
    text: 'אפשר להתחיל מדוגמה מוכנה או לבנות אוטומציה חדשה בשיחה:',
    variant: 'automation-options',
  },
  {
    match: 'חינם',
    text: 'מעולה! הכנתי טיוטת אוטומציה שתעדכן אתכם בכל פעם שמתפרסם, נוסף או מתעדכן פריט חינם במרקטפלייס:',
    variant: 'automation-review',
    automation: MARKETPLACE_FREE_AUTOMATION,
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

function NewChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 11.5A8.5 8.5 0 1 1 16.8 4.9" />
      <path d="M8 19.2 4 20l.8-4" />
      <line x1="18" y1="2.5" x2="18" y2="8.5" />
      <line x1="15" y1="5.5" x2="21" y2="5.5" />
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

function StaticLottie({
  animationData,
  className,
}: {
  animationData: object;
  className?: string;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={false}
      autoplay={false}
      className={className}
      onDOMLoaded={() => lottieRef.current?.goToAndStop(0, true)}
    />
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AutomationOptionsWidget({
  onSelect,
  onCustom,
}: {
  onSelect: (automation: AutomationTemplate) => void;
  onCustom: () => void;
}) {
  return (
    <section className="aibot-automation-options" aria-label="דוגמאות לאוטומציות">
      <header className="aibot-automation-options-header">
        <span className="text-small-bold">רעיונות להתחלה</span>
        <span className="text-tiny-normal">החליקו לעוד</span>
      </header>
      <div className="aibot-automation-options-track">
        {AUTOMATION_TEMPLATES.map((automation) => (
          <button
            key={automation.id}
            type="button"
            className={`aibot-automation-template is-${automation.tone}`}
            data-hook={`aibot-automation-${automation.id}`}
            onClick={() => onSelect(automation)}
          >
            <span className="aibot-automation-template-icon" aria-hidden="true">
              {automation.emoji}
            </span>
            <strong className="text-medium-bold">{automation.title}</strong>
            <span className="text-small-normal">{automation.description}</span>
            <span className="aibot-automation-template-action text-small-bold">
              לבחור
              <SuggestionChevron />
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="aibot-automation-custom text-small-bold"
        data-hook="aibot-automation-custom"
        onClick={onCustom}
      >
        לבנות אוטומציה משלי
      </button>
    </section>
  );
}

function AutomationReviewWidget({
  automation,
  onActivate,
  onOpenAutomations,
}: {
  automation: AutomationTemplate;
  onActivate: (automation: AutomationTemplate) => void;
  onOpenAutomations: () => void;
}) {
  const [active, setActive] = useState(false);

  const handleAction = () => {
    if (active) {
      onOpenAutomations();
      return;
    }
    setActive(true);
    onActivate(automation);
  };

  return (
    <section className={`aibot-automation-review${active ? ' is-active' : ''}`}>
      <header className="aibot-automation-review-header">
        <span className="aibot-automation-review-icon" aria-hidden="true">
          <Lottie
            animationData={automationToggleAnimation}
            loop={active}
            autoplay
          />
        </span>
        <span>
          <span className="aibot-automation-review-kicker text-tiny-normal">
            {active ? 'האוטומציה פעילה' : 'טיוטה לבדיקה'}
          </span>
          <strong className="aibot-automation-review-title text-medium-bold">
            {automation.title}
          </strong>
        </span>
      </header>
      <div className="aibot-automation-flow">
        <div className="aibot-automation-step">
          <span className="aibot-automation-step-label text-tiny-bold">כש...</span>
          <span className="text-small-normal">{automation.trigger}</span>
        </div>
        <span className="aibot-automation-connector" aria-hidden="true" />
        <div className="aibot-automation-step">
          <span className="aibot-automation-step-label text-tiny-bold">אז...</span>
          <span className="text-small-normal">{automation.action}</span>
        </div>
      </div>
      <button
        type="button"
        className="aibot-automation-activate text-small-bold"
        data-hook={`aibot-automation-activate-${automation.id}`}
        onClick={handleAction}
      >
        {active ? 'לכל האוטומציות' : 'להפעיל את האוטומציה'}
      </button>
    </section>
  );
}

function PoolUpdateWidget({ onNewsOpen }: { onNewsOpen: (id: string) => void }) {
  if (!POOL_UPDATE) return null;

  return (
    <article className="aibot-pool-update">
      <div className="aibot-pool-update-body">
        <span className="aibot-pool-update-visual" aria-hidden="true">
          <Lottie
            animationData={swimmingAnimation}
            loop
            autoplay
            className="aibot-pool-update-lottie"
          />
        </span>
        <span className="aibot-pool-update-copy">
          <span className="aibot-pool-update-label text-tiny-normal">
            {POOL_UPDATE.author.name} · {POOL_UPDATE.time}
          </span>
          <strong className="text-medium-bold">{POOL_UPDATE.title}</strong>
          <span className="aibot-pool-update-description text-small-normal">
            {POOL_UPDATE.desc}
          </span>
        </span>
      </div>
      <button
        type="button"
        className="aibot-pool-update-cta text-small-bold"
        data-hook="aibot-pool-update-details"
        onClick={() => onNewsOpen(POOL_UPDATE.id)}
      >
        לפרטים נוספים
      </button>
    </article>
  );
}

function EventOptionsWidget({ onEventsOpen }: { onEventsOpen: () => void }) {
  const dateFormatter = new Intl.DateTimeFormat('he-IL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <section
      className="aibot-events-widget"
      aria-label={`${UPCOMING_EVENTS.length} אירועים קרובים`}
    >
      <header className="aibot-events-header">
        <span className="text-small-bold">{UPCOMING_EVENTS.length} אירועים השבוע</span>
        <span className="aibot-events-hint text-tiny-normal">החליקו לעוד</span>
      </header>
      <div className="aibot-events-track">
        {UPCOMING_EVENTS.map((event) => (
          <article className="aibot-event-card" key={event.id}>
            <div className="aibot-event-card-top">
              <time className="aibot-event-date text-tiny-bold" dateTime={event.date}>
                {dateFormatter.format(new Date(`${event.date}T00:00:00`))}
              </time>
              <span className="aibot-event-category text-tiny-bold">{event.category}</span>
            </div>
            <strong className="aibot-event-title text-medium-bold">{event.title}</strong>
            <div className="aibot-event-details text-small-normal">
              <span>{event.startTime}–{event.endTime}</span>
              <span>
                <PinIcon />
                {event.location}
              </span>
            </div>
            <span className="aibot-event-friends text-tiny-normal">
              <UsersIcon />
              {event.friendsCount} חברים שלך מגיעים
            </span>
            <button
              type="button"
              className="aibot-event-cta text-small-bold"
              data-hook={`aibot-event-${event.id}`}
              onClick={onEventsOpen}
            >
              לפרטים והרשמה
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function VolunteerOptionsWidget() {
  return (
    <section
      className="aibot-volunteer-widget"
      aria-label={`${VOLUNTEER_REQUESTS.length} אפשרויות התנדבות זמינות`}
    >
      <header className="aibot-volunteer-header">
        <span className="text-small-bold">
          {VOLUNTEER_REQUESTS.length} אפשרויות עבורך
        </span>
        <span className="aibot-volunteer-hint text-tiny-normal">החליקו לעוד</span>
      </header>
      <div className="aibot-volunteer-track">
        {VOLUNTEER_REQUESTS.map((request) => (
          <article className="aibot-volunteer-card" key={request.id}>
            <div className="aibot-volunteer-person">
              <span className="aibot-volunteer-avatar" aria-hidden="true">
                <Lottie
                  animationData={request.avatarAnimation}
                  loop={false}
                  autoplay
                  className="aibot-volunteer-avatar-animation"
                />
              </span>
              <span className="aibot-volunteer-copy">
                <strong className="text-medium-bold">{request.name}</strong>
                <span className="text-small-normal">{request.task}</span>
              </span>
            </div>
            <dl className="aibot-volunteer-meta text-small-normal">
              <div className="aibot-volunteer-calendar-match">
                <dt>
                  <span className="aibot-volunteer-calendar-dot" aria-hidden="true" />
                  פנוי ביומן שלך
                </dt>
                <dd>{request.availability}</dd>
              </div>
              <div>
                <dt>משך</dt>
                <dd>{request.duration}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

type AIBotProps = {
  open: boolean;
  startRect: DOMRect | null;
  onClose: () => void;
  onAutomationActivate: (automation: AutomationTemplate) => void;
  onAutomationsOpen: () => void;
  onEventsOpen: () => void;
  onNewsOpen: (id: string) => void;
  initialMessage?: string;
  embedded?: boolean;
};

export default function AIBot({
  open,
  startRect,
  onClose,
  onAutomationActivate,
  onAutomationsOpen,
  onEventsOpen,
  onNewsOpen,
  initialMessage,
  embedded = false,
}: AIBotProps) {
  const [render, setRender] = useState(embedded);
  const [visible, setVisible] = useState(embedded);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [automationDraft, setAutomationDraft] = useState<CustomAutomationDraft | null>(null);
  const started = messages.length > 0;

  const inputRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const pendingTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const nextId = () => (idRef.current += 1);

  const clearPendingResponses = () => {
    pendingTimersRef.current.forEach(clearTimeout);
    pendingTimersRef.current.clear();
  };

  // Mount / unmount with a leaving animation
  useEffect(() => {
    if (embedded) return;
    if (open) {
      setRender(true);
      setClosing(false);
      return;
    }
    if (!render) return;
    clearPendingResponses();
    setVisible(false);
    setClosing(true);
    const t = setTimeout(() => {
      setRender(false);
      setClosing(false);
      setMessages([]);
      setInput('');
      setAutomationDraft(null);
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
    if (embedded) return;
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
    if (!render || embedded) return;
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

  const queueBotResponse = (
    text: string,
    variant?: MessageVariant,
    automation?: AutomationTemplate
  ) => {
    const typingId = nextId();
    const typingTimer = setTimeout(() => {
      pendingTimersRef.current.delete(typingTimer);
      setMessages((m) => [...m, { id: typingId, role: 'bot', text: '', typing: true }]);
    }, 350);
    pendingTimersRef.current.add(typingTimer);

    const replyTimer = setTimeout(() => {
      pendingTimersRef.current.delete(replyTimer);
      setMessages((m) =>
        m.map((message) =>
          message.id === typingId
            ? { ...message, typing: false, text, variant, automation }
            : message
        )
      );
    }, 1200);
    pendingTimersRef.current.add(replyTimer);
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    setMessages((m) => [...m, { id: nextId(), role: 'user', text }]);
    setInput('');

    if (automationDraft?.stage === 'trigger') {
      setAutomationDraft({ stage: 'action', trigger: text });
      queueBotResponse('ומה תרצו שיקרה אחר כך?');
      return;
    }

    if (automationDraft?.stage === 'action' && automationDraft.trigger) {
      const automation: AutomationTemplate = {
        id: `custom-${Date.now()}`,
        title: 'האוטומציה האישית שלך',
        description: `${automationDraft.trigger} → ${text}`,
        trigger: automationDraft.trigger,
        action: text,
        emoji: '✨',
        tone: 'custom',
      };
      setAutomationDraft(null);
      queueBotResponse(
        'הכנתי טיוטה לפי מה שביקשת. כדאי לבדוק שהכול נכון לפני ההפעלה:',
        'automation-review',
        automation
      );
      return;
    }

    const matchedReply = REPLIES.find((reply) => text.includes(reply.match));
    queueBotResponse(
      matchedReply?.text ?? FALLBACK,
      matchedReply?.variant,
      matchedReply?.automation
    );
  };

  const handleAutomationSelect = (automation: AutomationTemplate) => {
    setAutomationDraft(null);
    setMessages((messages) => [
      ...messages,
      {
        id: nextId(),
        role: 'user',
        text: `אני רוצה את האוטומציה: ${automation.title}`,
      },
    ]);
    queueBotResponse(
      'הכנתי טיוטה מהדוגמה שבחרת. כדאי לבדוק אותה לפני ההפעלה:',
      'automation-review',
      automation
    );
  };

  const handleCustomAutomation = () => {
    setMessages((messages) => [
      ...messages,
      {
        id: nextId(),
        role: 'user',
        text: 'אני רוצה לבנות אוטומציה משלי',
      },
    ]);
    setAutomationDraft({ stage: 'trigger' });
    queueBotResponse('מה צריך לקרות כדי להפעיל את האוטומציה?');
  };

  const handleNewChat = () => {
    clearPendingResponses();
    setMessages([]);
    setInput('');
    setAutomationDraft(null);
  };

  const handleClose = () => {
    if (embedded) {
      if (started) handleNewChat();
      return;
    }
    onClose();
  };

  if (!render) return null;

  return (
    <div
      className={`aibot${embedded || visible ? ' is-open' : ''}${closing ? ' is-closing' : ''}${embedded ? ' aibot--preview' : ''}`}
      role="dialog"
      aria-label="עוזר חכם"
      dir="rtl"
    >
      {!embedded && <div className="aibot-bg" />}

      <div className="aibot-top">
        <button type="button" className="aibot-back" onClick={handleClose} aria-label="סגירה">
          <CloseIcon />
        </button>
        <div className="aibot-id">
          <span className="aibot-id-dot" aria-hidden="true" />
          <span className="aibot-id-title">העוזר של גבעת אלה</span>
        </div>
        {started ? (
          <button
            type="button"
            className="aibot-new-chat"
            onClick={handleNewChat}
            aria-label="שיחה חדשה"
            title="שיחה חדשה"
          >
            <NewChatIcon />
          </button>
        ) : (
          <span className="aibot-top-spacer" aria-hidden="true" />
        )}
      </div>

      <div className="aibot-shell" ref={listRef}>
        {!started ? (
          <div className="aibot-welcome">
            <div className="aibot-avatar" aria-hidden="true">
              <svg className="aibot-avatar-sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 12.8 7.2 14.5 9.5C16.8 11.2 22 12 22 12C22 12 16.8 12.8 14.5 15.1C12.8 16.8 12 22 12 22C12 22 11.2 16.8 9.5 15.1C7.2 12.8 2 12 2 12C2 12 7.2 11.2 9.5 9.5C11.2 7.2 12 2 12 2Z" fill="currentColor"/>
                <path d="M19 2C19 2 19.4 4.6 20.25 5.75C21.4 6.6 24 7 24 7C24 7 21.4 7.4 20.25 8.55C19.4 9.4 19 12 19 12C19 12 18.6 9.4 17.75 8.55C16.6 7.4 14 7 14 7C14 7 16.6 6.6 17.75 5.75C18.6 4.6 19 2 19 2Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="aibot-greeting">
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
                  <span className="aibot-suggestion-emoji" aria-hidden="true">
                    {s.animation ? (
                      embedded ? (
                        <StaticLottie
                          animationData={s.animation}
                          className="aibot-suggestion-lottie"
                        />
                      ) : (
                        <Lottie
                          animationData={s.animation}
                          loop
                          autoplay
                          className="aibot-suggestion-lottie"
                        />
                      )
                    ) : (
                      s.emoji
                    )}
                  </span>
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
                <div
                  key={m.id}
                  className={`aibot-msg aibot-msg-bot${m.variant ? ' has-rich-response' : ''}`}
                >
                  <span className="aibot-msg-avatar" aria-hidden="true">
                    <svg className="aibot-msg-avatar-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C12 2 12.8 7.2 14.5 9.5C16.8 11.2 22 12 22 12C22 12 16.8 12.8 14.5 15.1C12.8 16.8 12 22 12 22C12 22 11.2 16.8 9.5 15.1C7.2 12.8 2 12 2 12C2 12 7.2 11.2 9.5 9.5C11.2 7.2 12 2 12 2Z" fill="currentColor"/>
                      <path d="M19 2C19 2 19.4 4.6 20.25 5.75C21.4 6.6 24 7 24 7C24 7 21.4 7.4 20.25 8.55C19.4 9.4 19 12 19 12C19 12 18.6 9.4 17.75 8.55C16.6 7.4 14 7 14 7C14 7 16.6 6.6 17.75 5.75C18.6 4.6 19 2 19 2Z" fill="currentColor"/>
                    </svg>
                  </span>
                  {m.typing ? (
                    <span className="aibot-thinking text-small-normal" aria-label="חושב">
                      רגע אני על זה...
                    </span>
                  ) : (
                    <div className="aibot-bot-response">
                      <div className="aibot-bubble aibot-bubble-bot">
                        <span className="text-medium-normal">{m.text}</span>
                      </div>
                      {m.variant === 'automation-options' && (
                        <AutomationOptionsWidget
                          onSelect={handleAutomationSelect}
                          onCustom={handleCustomAutomation}
                        />
                      )}
                      {m.variant === 'automation-review' && m.automation && (
                        <AutomationReviewWidget
                          automation={m.automation}
                          onActivate={onAutomationActivate}
                          onOpenAutomations={onAutomationsOpen}
                        />
                      )}
                      {m.variant === 'pool-update' && (
                        <PoolUpdateWidget onNewsOpen={onNewsOpen} />
                      )}
                      {m.variant === 'event-options' && (
                        <EventOptionsWidget onEventsOpen={onEventsOpen} />
                      )}
                      {m.variant === 'volunteer-options' && <VolunteerOptionsWidget />}
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
            placeholder={
              automationDraft?.stage === 'trigger'
                ? 'מה צריך להפעיל את האוטומציה?'
                : automationDraft?.stage === 'action'
                  ? 'מה תרצו שיקרה אחר כך?'
                  : 'שאל אותי כל דבר על הקהילה...'
            }
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
