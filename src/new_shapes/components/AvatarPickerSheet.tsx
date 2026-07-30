import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import './AvatarPickerSheet.css';

type AvatarPickerSheetProps = {
  open: boolean;
  onClose: () => void;
  onPhotoSelected: (file: File) => void;
};

export default function AvatarPickerSheet({ open, onClose, onPhotoSelected }: AvatarPickerSheetProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setRender(true);
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
    setVisible(false);
    const t = setTimeout(() => setRender(false), 320);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onClose]);

  if (!render) return null;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelected(file);
      onClose();
    }
    e.target.value = '';
  };

  return (
    <div className={`avatar-sheet-root${visible ? ' is-open' : ''}`} aria-hidden={!visible}>
      <button type="button" className="avatar-sheet-backdrop" onClick={onClose} aria-label="סגירה" />
      <div className="avatar-sheet" dir="rtl" role="dialog" aria-label="שינוי תמונת פרופיל">
        <p className="avatar-sheet-title text-medium-bold">שינוי תמונת פרופיל</p>
        <button
          type="button"
          className="avatar-sheet-action text-medium-normal"
          onClick={() => cameraRef.current?.click()}
        >
          צילום תמונה
        </button>
        <button
          type="button"
          className="avatar-sheet-action text-medium-normal"
          onClick={() => fileRef.current?.click()}
        >
          בחירה מהגלריה
        </button>
        <button type="button" className="avatar-sheet-cancel text-medium-normal" onClick={onClose}>
          ביטול
        </button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          hidden
          onChange={handleFile}
        />
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </div>
    </div>
  );
}
