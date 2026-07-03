import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import transmissionTowerAnim from '../assets/transmission-tower.json';
import polaroidsPhotosAnim from '../assets/polaroids-photos.json';
import checkMorphAnim from '../assets/check-morph-select.json';
import { overridePrimaryColor, overrideStrokeWidth, BLACK } from '../utils/lottieColor';
import {
  AI_ANALYZE_MS,
  EMPTY_REPORT_DRAFT,
  MOCK_AI_REPORT,
  type ReportNewsDraft,
} from '../data/reportNewsAiMock';
import { BackIcon, AiSparkleIcon } from './IconButton';
import ReportNewsTimeline, { type ReportNewsStep } from './ReportNewsTimeline';
import './ReportNewsPage.css';
import './NewsCard.css';

const PREVIEW_TOWER_ANIM = overrideStrokeWidth(overridePrimaryColor(transmissionTowerAnim, BLACK), 2.3);
const PREVIEW_TOWER_SEGMENT: [number, number] = [70, 175];
const PHOTO_EMPTY_SEGMENT: [number, number] = [70, 220];
const PREVIEW_SKELETON_MS = 2300;

function PhotoUploadLottie() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const playLoop = () => {
    lottieRef.current?.playSegments(PHOTO_EMPTY_SEGMENT, true);
  };

  useEffect(() => {
    playLoop();
  }, []);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={polaroidsPhotosAnim}
      loop={false}
      autoplay={false}
      initialSegment={PHOTO_EMPTY_SEGMENT}
      onDOMLoaded={playLoop}
      onComplete={playLoop}
      className="report-news-photo-empty-lottie"
    />
  );
}

function NewsTicketPreview({ draft }: { draft: ReportNewsDraft }) {
  const towerRef = useRef<LottieRefCurrentProps>(null);
  const [contentReady, setContentReady] = useState(false);
  const title = draft.title.trim() || 'כותרת העדכון תופיע כאן';

  useEffect(() => {
    const timer = window.setTimeout(() => setContentReady(true), PREVIEW_SKELETON_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!contentReady) return;
    towerRef.current?.playSegments(PREVIEW_TOWER_SEGMENT, true);
  }, [contentReady]);

  return (
    <div className="report-news-preview" dir="rtl">
      <article className={`news-note is-pinned note-scatter-1${draft.urgent ? ' is-urgent' : ''}`}>
        <div className="news-note-body report-news-ticket-body">
          <div
            className={`report-news-ticket-skeleton${contentReady ? ' is-hidden' : ''}`}
            aria-hidden={contentReady}
          >
            <div className="report-news-ticket-skeleton-visual" />
            <div className="report-news-ticket-skeleton-text">
              <div className="report-news-ticket-skeleton-line report-news-ticket-skeleton-line--title" />
              <div className="report-news-ticket-skeleton-line report-news-ticket-skeleton-line--title-short" />
              <div className="report-news-ticket-skeleton-line report-news-ticket-skeleton-line--time" />
            </div>
          </div>

          <div className={`report-news-ticket-content${contentReady ? ' is-visible' : ''}`}>
            <div className="news-note-visual">
              <Lottie
                lottieRef={towerRef}
                animationData={PREVIEW_TOWER_ANIM}
                loop={false}
                autoplay={false}
                initialSegment={PREVIEW_TOWER_SEGMENT}
                onDOMLoaded={() => {
                  if (contentReady) towerRef.current?.playSegments(PREVIEW_TOWER_SEGMENT, true);
                }}
                onComplete={() => towerRef.current?.playSegments(PREVIEW_TOWER_SEGMENT, true)}
                className="news-note-lottie"
              />
            </div>
            <div className="news-note-text">
              <p className="news-note-title text-medium-bold">{title}</p>
              <p className="news-note-timestamp text-tiny-normal">עכשיו</p>
            </div>
          </div>
        </div>
        <footer className="news-note-footer">
          <span className="news-note-footer-btn text-small-normal">לפרטים נוספים</span>
          <span className="news-note-footer-btn news-note-footer-btn--cta text-small-normal">
            <span className="news-note-footer-icon" aria-hidden="true">✓</span>
            סבבה
          </span>
        </footer>
      </article>
    </div>
  );
}

const URGENT_CHECK_ANIM = checkMorphAnim;
const URGENT_SELECT_SEGMENT: [number, number] = [140, 170];
const URGENT_DESELECT_SEGMENT: [number, number] = [170, 200];
const URGENT_IDLE_OFF_FRAME = 60;
const URGENT_IDLE_ON_FRAME = 169;

function UrgentCheckToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const paint = (selected: boolean, animate: boolean) => {
    const anim = lottieRef.current;
    if (!anim) return false;
    anim.setDirection(1);
    if (selected) {
      if (animate) {
        anim.playSegments(URGENT_SELECT_SEGMENT, true);
      } else {
        anim.goToAndStop(URGENT_IDLE_ON_FRAME, true);
      }
      return true;
    }
    if (animate) {
      anim.playSegments(URGENT_DESELECT_SEGMENT, true);
    } else {
      anim.goToAndStop(URGENT_IDLE_OFF_FRAME, true);
    }
    return true;
  };

  useEffect(() => {
    let attempts = 0;
    const tryPaint = () => {
      if (paint(checked, checked)) return;
      if (attempts < 24) {
        attempts += 1;
        requestAnimationFrame(tryPaint);
      }
    };
    tryPaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    const next = !checked;
    onChange(next);
    paint(next, true);
  };

  return (
    <button
      type="button"
      className="report-news-toggle-row"
      onClick={handleClick}
      aria-pressed={checked}
    >
      <span className="report-news-toggle-lottie-wrap" aria-hidden="true">
        <Lottie
          lottieRef={lottieRef}
          animationData={URGENT_CHECK_ANIM}
          loop={false}
          autoplay={checked}
          initialSegment={checked ? URGENT_SELECT_SEGMENT : undefined}
          onDOMLoaded={() => paint(checked, checked)}
          className="report-news-toggle-lottie"
        />
      </span>
      <span className="text-small-normal">סמן כדחוף</span>
    </button>
  );
}

type ReportPhase = 'upload' | 'review' | 'preview';

type ReportNewsPageProps = {
  open: boolean;
  onClose: () => void;
  onPublished?: () => void;
};

export default function ReportNewsPage({ open, onClose, onPublished }: ReportNewsPageProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [phase, setPhase] = useState<ReportPhase>('upload');
  const [isScanning, setIsScanning] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReportNewsDraft>(EMPTY_REPORT_DRAFT);
  const [aiReady, setAiReady] = useState(false);
  const [reviewEnter, setReviewEnter] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetForm = () => {
    setPhase('upload');
    setIsScanning(false);
    setPhotoUrl(null);
    setDraft(EMPTY_REPORT_DRAFT);
    setAiReady(false);
    setReviewEnter(false);
  };

  useEffect(() => {
    if (open) {
      resetForm();
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
    }, 420);
    return () => clearTimeout(t);
  }, [open, render]);

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

  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'review') {
      setReviewEnter(false);
      return;
    }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReviewEnter(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const runAiAnalysis = (url: string) => {
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setPhase('upload');
    setIsScanning(true);
    setAiReady(false);
    setDraft(EMPTY_REPORT_DRAFT);

    if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
    analyzeTimerRef.current = setTimeout(() => {
      setDraft(MOCK_AI_REPORT);
      setAiReady(true);
      setIsScanning(false);
      setPhase('review');
    }, AI_ANALYZE_MS);
  };

  const handlePhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    runAiAnalysis(URL.createObjectURL(file));
    e.target.value = '';
  };

  const removePhoto = () => {
    if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setDraft(EMPTY_REPORT_DRAFT);
    setAiReady(false);
    setIsScanning(false);
    setPhase('upload');
  };

  const canApproveReview =
    phase === 'review' &&
    draft.title.trim().length > 0 &&
    draft.description.trim().length > 0;

  const canContinueFromUpload =
    phase === 'upload' &&
    !!photoUrl &&
    aiReady &&
    draft.title.trim().length > 0 &&
    draft.description.trim().length > 0;

  const handleBack = () => {
    if (phase === 'preview') {
      setPhase('review');
      return;
    }
    if (phase === 'review') {
      setPhase('upload');
      return;
    }
    onClose();
  };

  const handlePrimaryAction = () => {
    if (phase === 'upload' && canContinueFromUpload) {
      setPhase('review');
      return;
    }
    if (phase === 'review' && canApproveReview) {
      setPhase('preview');
      return;
    }
    if (phase === 'preview') {
      onPublished?.();
      onClose();
    }
  };

  const timelineStep: ReportNewsStep = phase;
  const backDisabled = isScanning;

  if (!render) return null;

  return (
    <div
      className={`report-news${visible ? ' is-open' : ''}${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-label="דיווח עדכון חדש"
      dir="rtl"
    >
      <div className="report-news-bg" />

      <div className="report-news-top">
        <button
          type="button"
          className={`report-news-icon-btn${backDisabled ? ' is-disabled' : ''}`}
          onClick={handleBack}
          disabled={backDisabled}
          aria-label="חזרה"
        >
          <BackIcon />
        </button>
        <span className="report-news-top-title text-small-bold">עדכון חדש</span>
        <span className="report-news-top-spacer" aria-hidden="true" />
      </div>

      <div className={`report-news-scroll${phase === 'preview' ? ' has-preview-footer' : ''}`}>
        <ReportNewsTimeline currentStep={timelineStep} isScanning={isScanning} />

        <input
          ref={cameraRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          className="report-news-file-input"
          onChange={handlePhotoPick}
          aria-hidden="true"
          tabIndex={-1}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*,video/*"
          className="report-news-file-input"
          onChange={handlePhotoPick}
          aria-hidden="true"
          tabIndex={-1}
        />

        {(phase === 'upload' || phase === 'review') && (
          <section className="report-news-reveal report-news-photo-section">
            {photoUrl ? (
              <div className={`report-news-photo-card${phase === 'review' || isScanning ? ' is-compact' : ''}`}>
                <img src={photoUrl} alt="" className="report-news-photo" />
                {!isScanning && (
                  <button
                    type="button"
                    className="report-news-photo-remove"
                    onClick={removePhoto}
                    aria-label="הסרת תמונה"
                  >
                    ×
                  </button>
                )}
                {isScanning && (
                  <div className="report-news-photo-scan" aria-hidden="true" />
                )}
              </div>
            ) : (
              <div className="report-news-photo-empty">
                <span className="report-news-photo-empty-icon" aria-hidden="true">
                  <PhotoUploadLottie />
                </span>
                <span className="report-news-photo-empty-title text-medium-bold">הוסיפו תמונה או סרטון מהשטח</span>
                <span className="report-news-photo-empty-sub text-small-normal">
                  העוזר החכם יזהה מיקום ופרטים מהתוכן
                </span>
                <div className="report-news-photo-empty-actions">
                  <button
                    type="button"
                    className="btn-cta report-news-photo-action text-small-bold"
                    onClick={() => cameraRef.current?.click()}
                  >
                    צילום מהשטח
                  </button>
                  <button
                    type="button"
                    className="btn-secondary report-news-photo-action text-small-bold"
                    onClick={() => galleryRef.current?.click()}
                  >
                    בחירה מהגלריה
                  </button>
                </div>
              </div>
            )}

            {photoUrl && phase === 'upload' && !isScanning && (
              <div className="report-news-photo-repick">
                <button
                  type="button"
                  className="report-news-photo-repick-btn text-small-bold"
                  onClick={() => cameraRef.current?.click()}
                >
                  צילום חדש
                </button>
                <button
                  type="button"
                  className="report-news-photo-repick-btn text-small-bold"
                  onClick={() => galleryRef.current?.click()}
                >
                  בחירה מהגלריה
                </button>
              </div>
            )}
          </section>
        )}

        {isScanning && (
          <div className="report-news-reveal report-news-ai-status" aria-live="polite">
            <AiSparkleIcon className="report-news-ai-status-icon" />
            <div className="report-news-ai-status-text">
              <p className="text-small-bold">מנתח את התוכן...</p>
              <p className="text-tiny-normal">מזהה מיקום, סוג האירוע וטיוטת ניסוח</p>
            </div>
          </div>
        )}

        {phase === 'review' && (
          <div className={`report-news-review-enter${reviewEnter ? ' is-ready' : ''}`}>
            <div className="report-news-ai-banner report-news-review-item">
              <AiSparkleIcon className="report-news-ai-banner-icon" />
              <div className="report-news-ai-banner-copy">
                <p className="text-small-bold">העוזר מילא עבורכם טיוטה</p>
                <p className="text-tiny-normal">עברו על הפרטים, ערכו לפי הצורך ואשרו להמשך</p>
              </div>
            </div>

            <section className="report-news-fields" aria-label="פרטי העדכון">
              <label className="report-news-field report-news-review-item">
                <span className="report-news-field-label text-tiny-normal">
                  כותרת
                  {aiReady && <span className="report-news-ai-tag">AI</span>}
                </span>
                <input
                  className="report-news-input text-small-normal"
                  value={draft.title}
                  onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label className="report-news-field report-news-review-item">
                <span className="report-news-field-label text-tiny-normal">
                  מיקום
                  {aiReady && <span className="report-news-ai-tag">AI</span>}
                </span>
                <input
                  className="report-news-input text-small-normal"
                  value={draft.location}
                  onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))}
                />
              </label>

              <label className="report-news-field report-news-review-item">
                <span className="report-news-field-label text-tiny-normal">
                  מה קרה?
                  {aiReady && <span className="report-news-ai-tag">AI</span>}
                </span>
                <textarea
                  className="report-news-textarea text-small-normal"
                  value={draft.description}
                  onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </label>

              <label className="report-news-field report-news-review-item">
                <span className="report-news-field-label text-tiny-normal">תווית לכרטיס</span>
                <input
                  className="report-news-input text-small-normal"
                  value={draft.label}
                  onChange={(e) => setDraft((prev) => ({ ...prev, label: e.target.value }))}
                />
              </label>

              <div className="report-news-review-item">
                <UrgentCheckToggle
                  checked={draft.urgent}
                  onChange={(urgent) => setDraft((prev) => ({ ...prev, urgent }))}
                />
              </div>
            </section>

            <button
              type="button"
              className={`btn-cta report-news-approve-cta report-news-review-item text-medium-bold${canApproveReview ? '' : ' is-disabled'}`}
              onClick={handlePrimaryAction}
              disabled={!canApproveReview}
            >
              אני מאשר את הפרטים
            </button>
          </div>
        )}

        {phase === 'preview' && (
          <section className="report-news-reveal report-news-preview-section" aria-label="תצוגה מקדימה">
            <NewsTicketPreview draft={draft} />
          </section>
        )}
      </div>

      {phase === 'preview' && (
        <div className="report-news-preview-footer">
          <button
            type="button"
            className="btn-cta report-news-publish-cta text-medium-bold"
            onClick={handlePrimaryAction}
          >
            פרסום
          </button>
        </div>
      )}
    </div>
  );
}
