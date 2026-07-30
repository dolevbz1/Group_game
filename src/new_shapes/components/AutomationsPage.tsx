import { useState } from 'react';
import type { AutomationTemplate } from '../data/automationTemplates';
import { CloseIcon, IconButton } from './IconButton';
import './AutomationsPage.css';

type AutomationsPageProps = {
  open: boolean;
  automations: AutomationTemplate[];
  onClose: () => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (automation: AutomationTemplate) => void;
  onUpdate: (automation: AutomationTemplate) => void;
};

function AutomationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M8.5 7h4.25A3.25 3.25 0 0 1 16 10.25v4.25" />
      <path d="m13.5 12 2.5 2.5 2.5-2.5" />
    </svg>
  );
}

export default function AutomationsPage({
  open,
  automations,
  onClose,
  onCreate,
  onDelete,
  onDuplicate,
  onUpdate,
}: AutomationsPageProps) {
  const [menuAutomation, setMenuAutomation] = useState<AutomationTemplate | null>(null);
  const [editAutomation, setEditAutomation] = useState<AutomationTemplate | null>(null);
  const [deleteAutomation, setDeleteAutomation] = useState<AutomationTemplate | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTrigger, setEditTrigger] = useState('');
  const [editAction, setEditAction] = useState('');
  const enabledCount = automations.filter((automation) => automation.enabled !== false).length;

  const startEdit = (automation: AutomationTemplate) => {
    setMenuAutomation(null);
    setEditAutomation(automation);
    setEditTitle(automation.title);
    setEditTrigger(automation.trigger);
    setEditAction(automation.action);
  };

  const saveEdit = () => {
    if (!editAutomation || !editTitle.trim() || !editTrigger.trim() || !editAction.trim()) return;
    onUpdate({
      ...editAutomation,
      title: editTitle.trim(),
      trigger: editTrigger.trim(),
      action: editAction.trim(),
    });
    setEditAutomation(null);
  };

  return (
    <div
      className={`automations-page${open ? ' is-open' : ''}`}
      dir="rtl"
      aria-hidden={!open}
    >
      <div className="automations-page-top">
        <IconButton ariaLabel="סגירה" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <h1 className="automations-page-title">האוטומציות שלי</h1>
        <div className="automations-page-spacer" aria-hidden="true" />
      </div>

      <div className="automations-page-scroll">
        <section className="automations-page-hero">
          <span className="automations-page-hero-icon" aria-hidden="true">
            <AutomationIcon />
          </span>
          <span>
            <strong className="text-h2-bold">
              {automations.length > 0
                ? `${enabledCount} מתוך ${automations.length} פעילות`
                : 'עדיין אין אוטומציות פעילות'}
            </strong>
            <span className="automations-page-hero-copy text-small-normal">
              פעולות קטנות שקורות בשבילך באופן אוטומטי
            </span>
          </span>
        </section>

        {automations.length > 0 ? (
          <section className="automations-page-list" aria-label="אוטומציות פעילות">
            {automations.map((automation) => (
              <article
                key={automation.id}
                className={`automations-page-card is-${automation.tone}`}
              >
                <header className="automations-page-card-header">
                  <span className="automations-page-card-copy">
                    <strong className="text-medium-bold">{automation.title}</strong>
                    <span
                      className={`automations-page-status text-tiny-bold${
                        automation.enabled === false ? ' is-paused' : ''
                      }`}
                    >
                      <span aria-hidden="true" />
                      {automation.enabled === false ? 'מושהית' : 'פעילה'}
                    </span>
                  </span>
                  <span className="automations-page-card-actions">
                    <button
                      type="button"
                      className="automations-page-toggle"
                      data-hook={`automation-toggle-${automation.id}`}
                      aria-label={
                        automation.enabled === false
                          ? `הפעלת ${automation.title}`
                          : `השהיית ${automation.title}`
                      }
                      aria-pressed={automation.enabled !== false}
                      onClick={() =>
                        onUpdate({
                          ...automation,
                          enabled: automation.enabled === false,
                        })
                      }
                    >
                      <span />
                    </button>
                    <button
                      type="button"
                      className="automations-page-more"
                      data-hook={`automation-more-${automation.id}`}
                      aria-label={`פעולות נוספות עבור ${automation.title}`}
                      onClick={() => setMenuAutomation(automation)}
                    >
                      ···
                    </button>
                  </span>
                </header>
                <div className="automations-page-flow">
                  <div>
                    <span className="text-tiny-bold">כש...</span>
                    <span className="text-small-normal">{automation.trigger}</span>
                  </div>
                  <div>
                    <span className="text-tiny-bold">אז...</span>
                    <span className="text-small-normal">{automation.action}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="automations-page-empty">
            <span className="automations-page-empty-icon" aria-hidden="true">✨</span>
            <strong className="text-medium-bold">אפשר להתחיל ממשפט אחד</strong>
            <span className="text-small-normal">
              ספרו לעוזר מה תרצו שיקרה ומתי
            </span>
          </section>
        )}
      </div>

      <div className="automations-page-footer">
        <button
          type="button"
          className="automations-page-create text-medium-bold"
          data-hook="automations-create"
          onClick={onCreate}
        >
          יצירת אוטומציה חדשה
        </button>
      </div>

      {menuAutomation && (
        <div
          className="automations-page-overlay"
          role="presentation"
          onClick={() => setMenuAutomation(null)}
        >
          <section
            className="automations-page-actions-sheet"
            aria-label={`פעולות עבור ${menuAutomation.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <strong className="automations-page-actions-title text-medium-bold">
              {menuAutomation.title}
            </strong>
            <button
              type="button"
              className="automations-page-sheet-action text-medium-normal"
              onClick={() => startEdit(menuAutomation)}
            >
              עריכה
            </button>
            <button
              type="button"
              className="automations-page-sheet-action text-medium-normal"
              onClick={() => {
                onDuplicate({
                  ...menuAutomation,
                  id: `${menuAutomation.id}-copy-${Date.now()}`,
                  title: `${menuAutomation.title} – עותק`,
                  enabled: false,
                });
                setMenuAutomation(null);
              }}
            >
              שכפול
            </button>
            <button
              type="button"
              className="automations-page-sheet-action is-destructive text-medium-normal"
              onClick={() => {
                setDeleteAutomation(menuAutomation);
                setMenuAutomation(null);
              }}
            >
              מחיקה
            </button>
            <button
              type="button"
              className="automations-page-sheet-cancel text-medium-bold"
              onClick={() => setMenuAutomation(null)}
            >
              ביטול
            </button>
          </section>
        </div>
      )}

      {editAutomation && (
        <div className="automations-page-overlay">
          <form
            className="automations-page-editor"
            onSubmit={(event) => {
              event.preventDefault();
              saveEdit();
            }}
          >
            <h2 className="text-h2-bold">עריכת האוטומציה</h2>
            <label className="automations-page-field">
              <span className="text-small-bold">שם</span>
              <input
                className="text-medium-normal"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
              />
            </label>
            <label className="automations-page-field">
              <span className="text-small-bold">כש...</span>
              <textarea
                className="text-medium-normal"
                rows={2}
                value={editTrigger}
                onChange={(event) => setEditTrigger(event.target.value)}
              />
            </label>
            <label className="automations-page-field">
              <span className="text-small-bold">אז...</span>
              <textarea
                className="text-medium-normal"
                rows={2}
                value={editAction}
                onChange={(event) => setEditAction(event.target.value)}
              />
            </label>
            <div className="automations-page-editor-actions">
              <button
                type="button"
                className="automations-page-editor-cancel text-small-bold"
                onClick={() => setEditAutomation(null)}
              >
                ביטול
              </button>
              <button
                type="submit"
                className="automations-page-editor-save text-small-bold"
                disabled={!editTitle.trim() || !editTrigger.trim() || !editAction.trim()}
              >
                שמירת השינויים
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteAutomation && (
        <div className="automations-page-overlay">
          <section
            className="automations-page-delete-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="automation-delete-title"
          >
            <h2 id="automation-delete-title" className="text-h2-bold">
              למחוק את האוטומציה?
            </h2>
            <p className="text-small-normal">
              {deleteAutomation.title} תפסיק לפעול ותוסר מהרשימה.
            </p>
            <div className="automations-page-editor-actions">
              <button
                type="button"
                className="automations-page-editor-cancel text-small-bold"
                onClick={() => setDeleteAutomation(null)}
              >
                להשאיר אותה
              </button>
              <button
                type="button"
                className="automations-page-delete-confirm text-small-bold"
                onClick={() => {
                  onDelete(deleteAutomation.id);
                  setDeleteAutomation(null);
                }}
              >
                מחיקת האוטומציה
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
