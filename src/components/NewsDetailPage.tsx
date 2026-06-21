import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import swimmingAnim from '../assets/swimming.json';
import electricAnim from '../assets/electric-power.json';
import { getNewsById, type NewsItem } from '../data/newsItems';
import { CloseIcon, IconButton } from './IconButton';
import './NewsDetailPage.css';

type NewsDetailPageProps = {
  open: boolean;
  newsId: string | null;
  onClose: () => void;
};

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

export default function NewsDetailPage({ open, newsId, onClose }: NewsDetailPageProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const item = newsId ? getNewsById(newsId) : undefined;

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
          <div className="news-detail-hero-image" aria-hidden="true" />
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
            תגובות ({item.comments.length})
          </h2>
          <ul className="news-detail-comment-list">
            {item.comments.map((comment) => (
              <li key={comment.id} className="news-detail-comment">
                <div className="news-detail-comment-avatar">
                  <AvatarLottie animationData={comment.avatar} className="news-detail-comment-lottie" />
                </div>
                <div className="news-detail-comment-body">
                  <span className="news-detail-comment-name text-small-bold">{comment.name}</span>
                  <p className="news-detail-comment-text text-small-normal">{comment.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
