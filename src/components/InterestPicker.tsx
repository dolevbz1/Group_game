import { useEffect, useMemo, useState } from 'react';
import { INTEREST_CATALOG, MAX_INTERESTS } from '../data/interests';
import './InterestPicker.css';

type InterestPickerProps = {
  open: boolean;
  selectedIds: string[];
  onBack: () => void;
  onSave: (ids: string[]) => void;
};

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function InterestPicker({ open, selectedIds, onBack, onSave }: InterestPickerProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [draft, setDraft] = useState<string[]>(selectedIds);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      setDraft(selectedIds);
      setQuery('');
      setRender(true);
      setClosing(false);
      const t = setTimeout(() => setVisible(true), 16);
      return () => clearTimeout(t);
    }
    if (!render) return;
    setVisible(false);
    setClosing(true);
    const t = setTimeout(() => {
      setRender(false);
      setClosing(false);
    }, 380);
    return () => clearTimeout(t);
  }, [open, selectedIds, render]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onBack]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return INTEREST_CATALOG;
    return INTEREST_CATALOG.filter((item) => item.label.includes(q));
  }, [query]);

  if (!render) return null;

  const toggle = (id: string) => {
    setDraft((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, id];
    });
  };

  const handleSave = () => {
    onSave(draft);
    onBack();
  };

  return (
    <div
      className={`interest-pick${visible ? ' is-open' : ''}${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-label="בחירת תחומי עניין"
      dir="rtl"
    >
      <div className="interest-pick-top">
        <button type="button" className="interest-pick-icon-btn" onClick={onBack} aria-label="חזרה">
          <BackIcon />
        </button>
        <span className="interest-pick-top-title text-small-bold">תחומי עניין</span>
        <button type="button" className="interest-pick-save text-small-bold" onClick={handleSave}>
          שמירה
        </button>
      </div>

      <div className="interest-pick-scroll">
        <h2 className="interest-pick-heading text-h3-bold">בחר/י עד {MAX_INTERESTS} תחומים שמעניינים אותך</h2>
        <p className="interest-pick-note text-small-normal">
          לפי תחומי העניין נבחר לך מה להציג בעדכונים
        </p>

        <div className="interest-pick-search">
          <SearchIcon />
          <input
            className="interest-pick-search-input text-small-normal"
            type="search"
            placeholder="מה מעניין אותך?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {draft.length > 0 && (
          <div className="interest-pick-selected">
            {draft.map((id) => {
              const item = INTEREST_CATALOG.find((entry) => entry.id === id);
              if (!item) return null;
              return (
                <button
                  type="button"
                  key={id}
                  className="interest-pick-tag is-selected text-small-normal"
                  onClick={() => toggle(id)}
                >
                  <span aria-hidden="true">{item.emoji}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        <p className="interest-pick-section text-small-bold">אולי יעניין אותך...</p>
        <div className="interest-pick-grid">
          {filtered.map((item) => {
            const isSelected = draft.includes(item.id);
            const isFull = draft.length >= MAX_INTERESTS && !isSelected;
            return (
              <button
                type="button"
                key={item.id}
                className={`interest-pick-tag text-small-normal${isSelected ? ' is-selected' : ''}${isFull ? ' is-disabled' : ''}`}
                onClick={() => toggle(item.id)}
                disabled={isFull}
              >
                <span aria-hidden="true">{item.emoji}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="interest-pick-footer">
        <span className="interest-pick-count text-small-normal">{draft.length}/{MAX_INTERESTS} נבחרו</span>
        <button type="button" className="btn-cta interest-pick-done" onClick={handleSave}>
          שמירה
        </button>
      </div>
    </div>
  );
}
