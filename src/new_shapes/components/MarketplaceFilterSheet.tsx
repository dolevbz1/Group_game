import { useEffect, useState } from 'react';
import {
  CONDITION_OPTIONS,
  DEFAULT_MARKETPLACE_FILTERS,
  MarketplaceFilters,
  SORT_OPTIONS,
} from '../data/marketplaceListings';
import './MarketplaceFilterSheet.css';

type MarketplaceFilterSheetProps = {
  open: boolean;
  filters: MarketplaceFilters;
  onClose: () => void;
  onApply: (filters: MarketplaceFilters) => void;
};

export default function MarketplaceFilterSheet({
  open,
  filters,
  onClose,
  onApply,
}: MarketplaceFilterSheetProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState<MarketplaceFilters>(filters);

  useEffect(() => {
    if (open) {
      setDraft(filters);
      setRender(true);
      const timer = window.setTimeout(() => setVisible(true), 16);
      return () => window.clearTimeout(timer);
    }
    if (!render) return;
    setVisible(false);
    const timer = window.setTimeout(() => setRender(false), 380);
    return () => window.clearTimeout(timer);
  }, [open, filters, render]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onClose]);

  if (!render) return null;

  const toggleCondition = (id: MarketplaceFilters['conditions'][number]) => {
    setDraft((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(id)
        ? prev.conditions.filter((item) => item !== id)
        : [...prev.conditions, id],
    }));
  };

  const handleClear = () => {
    setDraft(DEFAULT_MARKETPLACE_FILTERS);
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <div
      className={`mfilter-root${visible ? ' is-open' : ''}`}
      aria-hidden={!visible}
      onClick={onClose}
    >
      <div className="mfilter-backdrop" />
      <div
        className="mfilter-sheet"
        dir="rtl"
        role="dialog"
        aria-label="סינון מודעות"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mfilter-handle" aria-hidden="true" />

        <div className="mfilter-head">
          <h2 className="mfilter-title text-medium-bold">סינון</h2>
          <button type="button" className="mfilter-clear text-small-normal" onClick={handleClear}>
            נקה
          </button>
        </div>

        <div className="mfilter-body">
          <section className="mfilter-section">
            <h3 className="mfilter-label text-small-bold">מחיר (₪)</h3>
            <div className="mfilter-price-row">
              <label className="mfilter-field">
                <span className="mfilter-field-hint text-tiny-normal">מינימום</span>
                <input
                  type="number"
                  inputMode="numeric"
                  className="mfilter-input text-small-normal"
                  placeholder="0"
                  value={draft.priceMin}
                  onChange={(e) => setDraft((prev) => ({ ...prev, priceMin: e.target.value }))}
                />
              </label>
              <span className="mfilter-price-sep text-small-normal" aria-hidden="true">—</span>
              <label className="mfilter-field">
                <span className="mfilter-field-hint text-tiny-normal">מקסימום</span>
                <input
                  type="number"
                  inputMode="numeric"
                  className="mfilter-input text-small-normal"
                  placeholder="ללא הגבלה"
                  value={draft.priceMax}
                  onChange={(e) => setDraft((prev) => ({ ...prev, priceMax: e.target.value }))}
                />
              </label>
            </div>
          </section>

          <section className="mfilter-section">
            <h3 className="mfilter-label text-small-bold">מצב</h3>
            <div className="mfilter-chips">
              {CONDITION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`mfilter-chip text-small-normal${draft.conditions.includes(option.id) ? ' is-active' : ''}`}
                  onClick={() => toggleCondition(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mfilter-section">
            <h3 className="mfilter-label text-small-bold">מיון</h3>
            <div className="mfilter-sort-list">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`mfilter-sort-row text-small-normal${draft.sort === option.id ? ' is-active' : ''}`}
                  onClick={() => setDraft((prev) => ({ ...prev, sort: option.id }))}
                >
                  <span>{option.label}</span>
                  <span className="mfilter-sort-check" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="mfilter-footer">
          <button type="button" className="mfilter-apply text-medium-bold" onClick={handleApply}>
            החל סינון
          </button>
        </footer>
      </div>
    </div>
  );
}
