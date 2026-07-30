import { useEffect, useState } from 'react';
import './EditIdentity.css';

export type IdentityData = {
  name: string;
  street: string;
  neighborhood: string;
};

type EditIdentityProps = {
  open: boolean;
  data: IdentityData;
  onBack: () => void;
  onSave: (data: IdentityData) => void;
};

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function EditIdentity({ open, data, onBack, onSave }: EditIdentityProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [draft, setDraft] = useState(data);

  useEffect(() => {
    if (open) {
      setDraft(data);
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
  }, [open, data, render]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onBack]);

  if (!render) return null;

  const canSave = draft.name.trim().length > 0 && draft.street.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      name: draft.name.trim(),
      street: draft.street.trim(),
      neighborhood: draft.neighborhood.trim() || 'גבעת אלה',
    });
    onBack();
  };

  return (
    <div
      className={`edit-id${visible ? ' is-open' : ''}${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-label="עריכת פרטים אישיים"
      dir="rtl"
    >
      <div className="edit-id-top">
        <button type="button" className="edit-id-icon-btn" onClick={onBack} aria-label="חזרה">
          <BackIcon />
        </button>
        <span className="edit-id-top-title text-small-bold">פרטים אישיים</span>
        <button
          type="button"
          className={`edit-id-save text-small-bold${canSave ? '' : ' is-disabled'}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          שמירה
        </button>
      </div>

      <div className="edit-id-scroll">
        <label className="edit-id-field">
          <span className="edit-id-label text-small-normal">שם מלא</span>
          <input
            className="edit-id-input text-medium-normal"
            type="text"
            value={draft.name}
            onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
            autoComplete="name"
          />
        </label>

        <label className="edit-id-field">
          <span className="edit-id-label text-small-normal">רחוב</span>
          <input
            className="edit-id-input text-medium-normal"
            type="text"
            value={draft.street}
            onChange={(e) => setDraft((prev) => ({ ...prev, street: e.target.value }))}
            autoComplete="street-address"
          />
        </label>

        <label className="edit-id-field">
          <span className="edit-id-label text-small-normal">שכונה</span>
          <input
            className="edit-id-input text-medium-normal"
            type="text"
            value={draft.neighborhood}
            onChange={(e) => setDraft((prev) => ({ ...prev, neighborhood: e.target.value }))}
          />
        </label>
      </div>
    </div>
  );
}
