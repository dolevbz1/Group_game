type PlaceholderViewProps = {
  title: string;
  subtitle: string;
  emoji: string;
};

export default function PlaceholderView({ title, subtitle, emoji }: PlaceholderViewProps) {
  return (
    <div className="admin-view admin-view--placeholder">
      <span className="admin-placeholder-emoji" aria-hidden="true">{emoji}</span>
      <h1 className="admin-view-title text-h2-bold">{title}</h1>
      <p className="admin-view-sub text-small-normal">{subtitle}</p>
      <p className="admin-placeholder-note text-tiny-normal">בקרוב בגרסה הבאה</p>
    </div>
  );
}
