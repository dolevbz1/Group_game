type ContentPageHeaderProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
};

export default function ContentPageHeader({
  title,
  subtitle,
  ctaLabel,
  onCta,
  secondaryAction,
}: ContentPageHeaderProps) {
  return (
    <header className="content-page-header">
      <div>
        <p className="admin-content-breadcrumb text-tiny-normal">תוכן</p>
        <h1 className="admin-view-title text-h2-bold">{title}</h1>
        <p className="admin-view-sub text-small-normal">{subtitle}</p>
      </div>
      <div className="content-page-actions">
        {secondaryAction && (
          <button
            type="button"
            className="admin-btn admin-btn--ghost text-small-bold"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </button>
        )}
        <button type="button" className="admin-btn admin-btn--primary text-small-bold" onClick={onCta}>
          {ctaLabel}
        </button>
      </div>
    </header>
  );
}
