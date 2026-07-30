export type AdminSection = 'inbox' | 'tasks' | 'ai' | 'content' | 'residents' | 'insights' | 'new' | 'settings';

type NavItem = {
  id: AdminSection;
  label: string;
  icon: () => React.ReactElement;
  badge?: number;
};

function InboxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="m8 8 1.5 1.5L12 7" />
      <path d="M14 9h3" />
      <path d="m8 14 1.5 1.5L12 13" />
      <path d="M14 15h3" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C12 2 12.8 7.2 14.5 9.5C16.8 11.2 22 12 22 12C22 12 16.8 12.8 14.5 15.1C12.8 16.8 12 22 12 22C12 22 11.2 16.8 9.5 15.1C7.2 12.8 2 12 2 12C2 12 7.2 11.2 9.5 9.5C11.2 7.2 12 2 12 2Z" fill="currentColor" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ResidentsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function FlowMapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="9" width="6" height="6" rx="1" />
      <rect x="16" y="3" width="6" height="6" rx="1" />
      <rect x="16" y="15" width="6" height="6" rx="1" />
      <path d="M8 12h4M12 12v-6h4M12 12v6h4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inbox', label: 'תיבת פעולות', icon: InboxIcon },
  { id: 'tasks', label: 'משימות', icon: TasksIcon },
  { id: 'ai', label: 'סוכן AI לתושבים', icon: AIIcon },
  { id: 'content', label: 'תוכן', icon: ContentIcon },
  { id: 'residents', label: 'תושבים', icon: ResidentsIcon },
  { id: 'insights', label: 'תובנות', icon: InsightsIcon },
  { id: 'new', label: 'מפת מידע', icon: FlowMapIcon },
];

type SidebarProps = {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  pendingCount: number;
  taskCount: number;
};

export default function Sidebar({ active, onNavigate, pendingCount, taskCount }: SidebarProps) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-top">
        <div className="admin-brand">
          <span className="admin-brand-mark" aria-hidden="true">גא</span>
          <div className="admin-brand-text">
            <span className="admin-brand-name text-small-bold">גבעת אלה</span>
            <span className="admin-brand-role text-tiny-normal">מנהל קהילה</span>
          </div>
        </div>
      </div>

      <nav className="admin-nav" aria-label="ניווט ראשי">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const badge =
            item.id === 'inbox'
              ? pendingCount
              : item.id === 'tasks'
                ? taskCount
                : undefined;
          return (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item${isActive ? ' is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="admin-nav-icon" aria-hidden="true">
                <item.icon />
              </span>
              <span className="admin-nav-label text-small-normal">{item.label}</span>
              {badge !== undefined && badge > 0 && (
                <span className="admin-nav-badge text-tiny-bold">{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar-promo">
        <p className="admin-promo-title text-small-bold">סוכן AI פעיל</p>
        <p className="admin-promo-body text-tiny-normal">42 פעולות טופלו אוטומטית היום</p>
        <button type="button" className="admin-promo-btn text-tiny-bold" onClick={() => onNavigate('ai')}>
          צפה בפעילות
        </button>
      </div>

      <div className="admin-sidebar-bottom">
        <button
          type="button"
          className={`admin-nav-item admin-nav-item--sub${active === 'settings' ? ' is-active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <span className="admin-nav-icon" aria-hidden="true"><SettingsIcon /></span>
          <span className="admin-nav-label text-small-normal">הגדרות</span>
        </button>
        <a href="/" className="admin-preview-link text-tiny-normal" target="_blank" rel="noreferrer">
          תצוגת אפליקציית תושבים ↗
        </a>
      </div>
    </aside>
  );
}
