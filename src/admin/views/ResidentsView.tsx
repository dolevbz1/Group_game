import { useMemo, useState } from 'react';
import {
  RESIDENTS,
  RESIDENT_ENGAGEMENT_LABELS,
  RESIDENT_STATUS_LABELS,
  type Resident,
  type ResidentEngagement,
  type ResidentStatus,
} from '../data/residentsMockData';
import ResidentAvatar from '../components/ResidentAvatar';

type ResidentsViewProps = {
  onSelectResident: (resident: Resident) => void;
};

type SortKey = 'name' | 'engagement' | 'lastActive';
type SortDirection = 'ascending' | 'descending';

const ENGAGEMENT_WEIGHT: Record<ResidentEngagement, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SortIndicator({ active, direction }: { active: boolean; direction: SortDirection }) {
  return <span aria-hidden="true">{active ? (direction === 'ascending' ? '↑' : '↓') : '↕'}</span>;
}

export default function ResidentsView({ onSelectResident }: ResidentsViewProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | ResidentStatus>('all');
  const [engagement, setEngagement] = useState<'all' | ResidentEngagement>('all');
  const [street, setStreet] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('lastActive');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');

  const streets = useMemo(
    () => Array.from(new Set(RESIDENTS.map((resident) => resident.street))).sort((a, b) => a.localeCompare(b, 'he')),
    []
  );

  const filteredResidents = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('he');
    const filtered = RESIDENTS.filter((resident) => {
      const searchable = [
        resident.name,
        resident.email,
        resident.phone,
        resident.street,
        resident.houseNumber,
      ].join(' ').toLocaleLowerCase('he');

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (status === 'all' || resident.status === status) &&
        (engagement === 'all' || resident.engagement === engagement) &&
        (street === 'all' || resident.street === street)
      );
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'name') comparison = a.name.localeCompare(b.name, 'he');
      if (sortKey === 'engagement') comparison = ENGAGEMENT_WEIGHT[a.engagement] - ENGAGEMENT_WEIGHT[b.engagement];
      if (sortKey === 'lastActive') comparison = a.lastActiveDays - b.lastActiveDays;
      return sortDirection === 'ascending' ? comparison : -comparison;
    });
  }, [engagement, query, sortDirection, sortKey, status, street]);

  const activeFilterCount =
    Number(Boolean(query.trim())) +
    Number(status !== 'all') +
    Number(engagement !== 'all') +
    Number(street !== 'all');

  const updateSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setSortDirection((current) => current === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortKey(nextKey);
      setSortDirection('ascending');
    }
  };

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setEngagement('all');
    setStreet('all');
  };

  const exportResidents = () => {
    const rows = filteredResidents.map((resident) => [
      resident.name,
      resident.email,
      resident.phone,
      `${resident.street} ${resident.houseNumber}`,
      RESIDENT_STATUS_LABELS[resident.status],
      RESIDENT_ENGAGEMENT_LABELS[resident.engagement],
      resident.lastActiveLabel,
    ]);
    const csv = [
      ['שם', 'מייל', 'טלפון', 'כתובת', 'סטטוס', 'מעורבות', 'פעילות אחרונה'],
      ...rows,
    ].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'residents.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getAriaSort = (key: SortKey) => sortKey === key ? sortDirection : 'none';

  return (
    <div className="admin-view admin-view--residents">
      <header className="admin-view-header residents-view-header">
        <div>
          <h1 className="admin-view-title text-h2-bold">תושבים</h1>
          <p className="admin-view-sub text-small-normal">
            פרטי קשר, מעורבות והיסטוריית פעילות במקום אחד
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--ghost text-small-bold" onClick={exportResidents}>
          ייצוא הרשימה
        </button>
      </header>

      <section className="residents-directory-card" aria-labelledby="residents-results-title">
        <div className="residents-toolbar">
          <label className="residents-search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              className="residents-search-input text-small-normal"
              placeholder="חיפוש לפי שם, כתובת, טלפון או מייל"
            />
          </label>

          <label className="residents-filter">
            <span className="text-tiny-normal">סטטוס</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as 'all' | ResidentStatus);
              }}
              className="text-small-normal"
            >
              <option value="all">הכול</option>
              <option value="active">פעילים</option>
              <option value="attention">דורשים תשומת לב</option>
              <option value="new">חדשים</option>
            </select>
          </label>

          <label className="residents-filter">
            <span className="text-tiny-normal">מעורבות</span>
            <select
              value={engagement}
              onChange={(event) => {
                setEngagement(event.target.value as 'all' | ResidentEngagement);
              }}
              className="text-small-normal"
            >
              <option value="all">הכול</option>
              <option value="high">גבוהה</option>
              <option value="medium">בינונית</option>
              <option value="low">נמוכה</option>
            </select>
          </label>

          <label className="residents-filter">
            <span className="text-tiny-normal">רחוב</span>
            <select
              value={street}
              onChange={(event) => {
                setStreet(event.target.value);
              }}
              className="text-small-normal"
            >
              <option value="all">כל הרחובות</option>
              {streets.map((streetName) => (
                <option key={streetName} value={streetName}>{streetName}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="residents-filter-summary">
          <p id="residents-results-title" className="text-small-bold" aria-live="polite">
            {filteredResidents.length} תושבים
          </p>
          {activeFilterCount > 0 && (
            <div className="residents-active-filters">
              {query.trim() && (
                <button type="button" className="resident-filter-chip text-tiny-normal" onClick={() => {
                  setQuery('');
                }}>
                  חיפוש: {query} ×
                </button>
              )}
              {status !== 'all' && (
                <button type="button" className="resident-filter-chip text-tiny-normal" onClick={() => {
                  setStatus('all');
                }}>
                  {RESIDENT_STATUS_LABELS[status]} ×
                </button>
              )}
              {engagement !== 'all' && (
                <button type="button" className="resident-filter-chip text-tiny-normal" onClick={() => {
                  setEngagement('all');
                }}>
                  מעורבות {RESIDENT_ENGAGEMENT_LABELS[engagement]} ×
                </button>
              )}
              {street !== 'all' && (
                <button type="button" className="resident-filter-chip text-tiny-normal" onClick={() => {
                  setStreet('all');
                }}>
                  {street} ×
                </button>
              )}
              <button type="button" className="residents-clear-filters text-tiny-bold" onClick={clearFilters}>
                ניקוי הכול
              </button>
            </div>
          )}
        </div>

        <div className="residents-table-scroll">
          <table className="residents-table">
            <thead>
              <tr>
                <th scope="col" aria-sort={getAriaSort('name')}>
                  <button type="button" onClick={() => updateSort('name')} className="residents-sort text-tiny-bold">
                    תושב/ת
                    <SortIndicator active={sortKey === 'name'} direction={sortDirection} />
                  </button>
                </th>
                <th scope="col" className="text-tiny-bold">פרטי קשר</th>
                <th scope="col" className="text-tiny-bold">כתובת</th>
                <th scope="col" aria-sort={getAriaSort('engagement')}>
                  <button type="button" onClick={() => updateSort('engagement')} className="residents-sort text-tiny-bold">
                    מעורבות
                    <SortIndicator active={sortKey === 'engagement'} direction={sortDirection} />
                  </button>
                </th>
                <th scope="col" aria-sort={getAriaSort('lastActive')}>
                  <button type="button" onClick={() => updateSort('lastActive')} className="residents-sort text-tiny-bold">
                    פעילות אחרונה
                    <SortIndicator active={sortKey === 'lastActive'} direction={sortDirection} />
                  </button>
                </th>
                <th scope="col" className="text-tiny-bold">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map((resident) => (
                <tr
                  key={resident.id}
                  className="resident-table-row"
                  tabIndex={0}
                  onClick={() => onSelectResident(resident)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectResident(resident);
                    }
                  }}
                  aria-label={`פתיחת הפרטים של ${resident.name}`}
                >
                  <th scope="row">
                    <div className="resident-cell-identity">
                      <ResidentAvatar
                        animationData={resident.avatarAnimation}
                        engagement={resident.engagement}
                      />
                      <span>
                        <strong className="resident-cell-name text-small-bold">{resident.name}</strong>
                        <span className="resident-cell-sub text-tiny-normal">
                          {resident.verified ? 'מאומת/ת' : 'נדרש אימות'}
                        </span>
                      </span>
                    </div>
                  </th>
                  <td>
                    <span className="resident-contact-main text-small-normal">{resident.phone}</span>
                    <span className="resident-cell-sub text-tiny-normal">{resident.email}</span>
                  </td>
                  <td>
                    <span className="text-small-normal">{resident.street} {resident.houseNumber}</span>
                    <span className="resident-cell-sub text-tiny-normal">{resident.householdSize} במשק הבית</span>
                  </td>
                  <td>
                    <span className={`resident-engagement resident-engagement--${resident.engagement} text-tiny-bold`}>
                      {RESIDENT_ENGAGEMENT_LABELS[resident.engagement]}
                    </span>
                  </td>
                  <td>
                    <span className="text-small-normal">{resident.lastActiveLabel}</span>
                  </td>
                  <td>
                    <span className={`resident-status resident-status--${resident.status} text-tiny-bold`}>
                      {RESIDENT_STATUS_LABELS[resident.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResidents.length === 0 && (
            <div className="residents-empty">
              <span aria-hidden="true">⌕</span>
              <p className="text-small-bold">לא נמצאו תושבים שמתאימים לסינון</p>
              <button type="button" className="admin-btn admin-btn--ghost text-small-normal" onClick={clearFilters}>
                ניקוי מסננים
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
