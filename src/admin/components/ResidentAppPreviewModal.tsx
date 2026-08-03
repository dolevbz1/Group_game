import { useEffect, useRef } from 'react';

type ResidentAppPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResidentAppPreviewModal({ isOpen, onClose }: ResidentAppPreviewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, 120);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-app-modal" role="presentation">
      <button
        type="button"
        className="admin-app-modal-backdrop"
        onClick={onClose}
        aria-label="סגור תצוגה מקדימה"
      />
      <div
        className="admin-app-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-app-modal-title"
      >
        <div className="admin-app-modal-head">
          <div>
            <h2 id="admin-app-modal-title" className="admin-app-modal-title text-medium-bold">
              תצוגת אפליקציית תושבים
            </h2>
            <p className="admin-app-modal-sub text-tiny-normal">New Shapes · כפי שתושבים רואים ביישוב</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="admin-app-modal-close"
            onClick={onClose}
            aria-label="סגור"
          >
            ✕
          </button>
        </div>

        <div className="admin-app-modal-device">
          <div className="admin-phone-frame admin-phone-frame--modal">
            <div className="admin-phone-notch" aria-hidden="true" />
            <div className="admin-phone-screen admin-phone-screen--modal">
              <iframe
                className="admin-phone-iframe"
                src="/new_shapes.html"
                title="תצוגה מקדימה של אפליקציית התושבים"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
