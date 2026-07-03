import './ReportNewsTimeline.css';

export type ReportNewsStep = 'upload' | 'review' | 'preview' | 'done';

const STEPS: { id: ReportNewsStep; label: string }[] = [
  { id: 'upload', label: 'העלאה' },
  { id: 'review', label: 'עריכה' },
  { id: 'preview', label: 'תצוגה' },
  { id: 'done', label: 'סיום' },
];

const STEP_HINTS: Record<ReportNewsStep, string> = {
  upload: 'העלו תמונה או סרטון מהשטח',
  review: 'עברו על הפרטים ואשרו אותם',
  preview: 'כך העדכון יופיע לשכנים — אשרו לפרסום',
  done: 'העדכון פורסם בהצלחה',
};

const UPLOAD_SCANNING_HINT = 'העוזר החכם סורק ומבין את התוכן';

type ReportNewsTimelineProps = {
  currentStep: ReportNewsStep;
  isScanning?: boolean;
};

export function stepIndex(step: ReportNewsStep) {
  return STEPS.findIndex((s) => s.id === step);
}

export default function ReportNewsTimeline({ currentStep, isScanning = false }: ReportNewsTimelineProps) {
  const activeIndex = stepIndex(currentStep);
  const progressRatio = STEPS.length > 1 ? activeIndex / (STEPS.length - 1) : 0;
  const hint =
    currentStep === 'upload' && isScanning ? UPLOAD_SCANNING_HINT : STEP_HINTS[currentStep];

  return (
    <nav className="report-news-timeline" aria-label="שלבי הדיווח">
      <ol
        className="report-news-timeline-track"
        style={{
          '--step-count': STEPS.length,
          '--timeline-progress': progressRatio,
        } as React.CSSProperties}
      >
        {STEPS.map((step, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;
          const isUpcoming = index > activeIndex;

          return (
            <li
              key={step.id}
              className={`report-news-timeline-step${isComplete ? ' is-complete' : ''}${isActive ? ' is-active' : ''}${isUpcoming ? ' is-upcoming' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="report-news-timeline-node-wrap">
                <span className="report-news-timeline-node" aria-hidden="true">
                  {isComplete ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4.2L3.6 6.8L9 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="report-news-timeline-dot" />
                  )}
                </span>
              </div>
              <span className="report-news-timeline-label text-tiny-normal">{step.label}</span>
            </li>
          );
        })}
      </ol>
      <p className="report-news-timeline-hint text-h2-bold">{hint}</p>
    </nav>
  );
}
