import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import Lottie from 'lottie-react';
import swimmingAnim from '../assets/swimming.json';
import electricAnim from '../assets/electric-power.json';
import currentUserAvatar from '../assets/avatar-person.json';
import { getNewsById, type NewsComment, type NewsItem, type NewsReply } from '../data/newsItems';
import { CloseIcon, IconButton, AiSparkleIcon } from './IconButton';
import './NewsDetailPage.css';

const CURRENT_USER_NAME = 'טל לוינסקי';
const MAX_COMMENT_LENGTH = 500;

type NewsDetailPageProps = {
  open: boolean;
  newsId: string | null;
  onClose: () => void;
};

function formatReplyCount(count: number): string {
  if (count === 1) return 'תגובה אחת';
  return `${count} תגובות`;
}

function countAllComments(comments: NewsComment[]): number {
  return comments.reduce((total, comment) => total + 1 + (comment.replies?.length ?? 0), 0);
}

function NewsVisualIcon({ item }: { item: NewsItem }) {
  if (item.loopAnim && item.anim) {
    return <Lottie animationData={item.anim} loop className="news-detail-icon-lottie" />;
  }
  if (item.hasLottie) {
    return <Lottie animationData={swimmingAnim} loop={false} className="news-detail-icon-lottie" />;
  }
  if (item.hasElectricLottie) {
    return <Lottie animationData={electricAnim} loop={false} className="news-detail-icon-lottie" />;
  }
  return <span className="news-detail-icon-emoji">{item.emoji}</span>;
}

function AvatarLottie({ animationData, className }: { animationData: object; className: string }) {
  return <Lottie animationData={animationData} loop={false} autoplay className={className} />;
}

function ReplyAvatar({ reply }: { reply: NewsReply }) {
  if (reply.isAiAvatar) {
    return <AiSparkleIcon className="news-detail-thread-reply-sparkle" />;
  }
  if (reply.avatar) {
    return <AvatarLottie animationData={reply.avatar} className="news-detail-thread-reply-lottie" />;
  }
  return null;
}

function ThreadSummaryAvatars({ replies }: { replies: NewsReply[] }) {
  const avatars = replies.slice(0, 3);

  return (
    <span className="news-detail-thread-avatars" aria-hidden="true">
      {avatars.map((reply) => (
        <span key={reply.id} className="news-detail-thread-avatar">
          {reply.isAiAvatar ? (
            <AiSparkleIcon className="news-detail-thread-avatar-sparkle" />
          ) : reply.avatar ? (
            <AvatarLottie animationData={reply.avatar} className="news-detail-thread-avatar-lottie" />
          ) : null}
        </span>
      ))}
    </span>
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

function CommentComposer({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmedDraft = draft.trim();
  const canSubmit = trimmedDraft.length > 0 && trimmedDraft.length <= MAX_COMMENT_LENGTH;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(trimmedDraft);
    setDraft('');
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form className="news-detail-composer" onSubmit={handleSubmit} aria-label="הוספת תגובה">
      <div className="news-detail-composer-avatar" aria-hidden="true">
        <AvatarLottie animationData={currentUserAvatar} className="news-detail-comment-lottie" />
      </div>
      <div className="news-detail-composer-field">
        <div className="news-detail-composer-card">
          <textarea
            ref={textareaRef}
            id="news-detail-comment-input"
            className="news-detail-composer-input text-small-normal"
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder="כתבו תגובה לשכנים"
            rows={2}
            maxLength={MAX_COMMENT_LENGTH}
            aria-describedby="news-detail-comment-hint"
          />
          <button
            type="submit"
            className="news-detail-composer-send"
            aria-label="פרסום תגובה"
            disabled={!canSubmit}
            onMouseDown={(e) => e.preventDefault()}
          >
            <SendArrowIcon />
          </button>
        </div>
        <p
          id="news-detail-comment-hint"
          className={`news-detail-composer-hint text-tiny-normal${draft.length >= MAX_COMMENT_LENGTH - 40 ? ' is-visible' : ''}`}
        >
          {draft.length}/{MAX_COMMENT_LENGTH}
        </p>
      </div>
    </form>
  );
}

function CommentThread({ comment }: { comment: NewsComment }) {
  const replies = comment.replies ?? [];
  const hasThread = replies.length > 0;
  const [threadOpen, setThreadOpen] = useState(false);

  if (!hasThread) {
    return (
      <li className="news-detail-comment">
        <div className="news-detail-comment-avatar">
          <AvatarLottie animationData={comment.avatar} className="news-detail-comment-lottie" />
        </div>
        <div className="news-detail-comment-body">
          <span className="news-detail-comment-name text-small-bold">{comment.name}</span>
          <p className="news-detail-comment-text text-small-normal">{comment.text}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="news-detail-comment news-detail-comment--threaded">
      <div className="news-detail-comment-main">
        <div className="news-detail-comment-avatar">
          <AvatarLottie animationData={comment.avatar} className="news-detail-comment-lottie" />
        </div>
        <div className="news-detail-comment-body">
          <span className="news-detail-comment-name text-small-bold">{comment.name}</span>
          <p className="news-detail-comment-text text-small-normal">{comment.text}</p>

          {threadOpen && (
            <ul className="news-detail-thread-replies" aria-label={`תגובות ל${comment.name}`}>
              {replies.map((reply) => (
                <li key={reply.id} className="news-detail-thread-reply">
                  <div className="news-detail-thread-reply-avatar">
                    <ReplyAvatar reply={reply} />
                  </div>
                  <div className="news-detail-thread-reply-body">
                    <div className="news-detail-thread-reply-meta">
                      <span className="news-detail-thread-reply-name text-small-bold">{reply.name}</span>
                      <span className="news-detail-thread-reply-time text-tiny-normal">{reply.postedAt}</span>
                    </div>
                    <p className="news-detail-thread-reply-text text-small-normal">{reply.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {threadOpen ? (
            <button
              type="button"
              className="news-detail-thread-collapse text-small-bold"
              onClick={() => setThreadOpen(false)}
              aria-label="הסתרת תגובות"
            >
              הסתר תגובות
            </button>
          ) : (
            <button
              type="button"
              className="news-detail-thread-summary"
              onClick={() => setThreadOpen(true)}
              aria-expanded={false}
              aria-label={`פתיחת ${formatReplyCount(replies.length)}`}
            >
              <ThreadSummaryAvatars replies={replies} />
              <span className="news-detail-thread-count text-small-bold">
                {formatReplyCount(replies.length)}
              </span>
              {comment.lastReplyAt && (
                <span className="news-detail-thread-time text-small-normal">{comment.lastReplyAt}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default function NewsDetailPage({ open, newsId, onClose }: NewsDetailPageProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [comments, setComments] = useState<NewsComment[]>([]);

  const item = newsId ? getNewsById(newsId) : undefined;

  useEffect(() => {
    if (!item) return;
    setComments(item.comments);
  }, [newsId, item]);

  useEffect(() => {
    if (open && newsId) {
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
    }, 480);
    return () => clearTimeout(t);
  }, [open, newsId, render]);

  useEffect(() => {
    if (!render) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [render]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onClose]);

  const handleAddComment = (text: string) => {
    const newComment: NewsComment = {
      id: `user-${Date.now()}`,
      name: CURRENT_USER_NAME,
      text,
      avatar: currentUserAvatar,
    };
    setComments((prev) => [...prev, newComment]);
  };

  if (!render || !item) return null;

  return (
    <div
      className={`news-detail${visible ? ' is-open' : ''}${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-label="פרטי עדכון"
      dir="rtl"
    >
      <div className="news-detail-bg" />

      <div className="news-detail-top">
        <IconButton ariaLabel="סגירה" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <span className="news-detail-top-title text-small-bold">עדכון</span>
        <div className="news-detail-top-spacer" aria-hidden="true" />
      </div>

      <div className="news-detail-scroll">
        <div className="news-detail-reveal news-detail-hero">
          {item.heroImage ? (
            <img
              src={item.heroImage}
              alt=""
              className="news-detail-hero-image news-detail-hero-image--photo"
            />
          ) : (
            <div className="news-detail-hero-image" aria-hidden="true" />
          )}
          <div className="news-detail-icon" aria-hidden="true">
            <NewsVisualIcon item={item} />
          </div>
        </div>

        <div className="news-detail-reveal news-detail-content">
          <h1 className="news-detail-title text-h2-bold">{item.title}</h1>

          <div className="news-detail-author">
            <div className="news-detail-author-avatar">
              <AvatarLottie animationData={item.author.avatar} className="news-detail-author-lottie" />
            </div>
            <div className="news-detail-author-meta">
              <span className="news-detail-author-name text-small-bold">{item.author.name}</span>
              <span className="news-detail-author-sub text-tiny-normal">
                {item.postedAt} · {item.readMinutes} דק׳ קריאה
              </span>
            </div>
          </div>

          <p className="news-detail-updated text-tiny-normal">עודכן: {item.updatedAt}</p>
          <p className="news-detail-body text-medium-normal">{item.body}</p>
        </div>

        <section className="news-detail-reveal news-detail-comments" aria-label="תגובות">
          <h2 className="news-detail-comments-title text-h3-bold">
            תגובות ({countAllComments(comments)})
          </h2>
          <ul className="news-detail-comment-list" aria-live="polite" aria-relevant="additions">
            {comments.map((comment) => (
              <CommentThread key={comment.id} comment={comment} />
            ))}
          </ul>
          <CommentComposer onSubmit={handleAddComment} />
        </section>
      </div>
    </div>
  );
}
