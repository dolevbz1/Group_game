import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import avatarAnim from '../assets/avatar-person.json';
import toggleAnim from '../assets/toggle.json';
import { overridePrimaryColor, BLACK } from '../utils/lottieColor';
import { DEFAULT_INTEREST_IDS, getInterestById } from '../data/interests';
import AvatarPickerSheet from './AvatarPickerSheet';
import { type IdentityData } from './EditIdentity';
import { CloseIcon, IconButton, PencilIcon } from './IconButton';
import InterestPicker from './InterestPicker';
import PublicProfile from './PublicProfile';
import './Profile.css';

const notifyToggleAnim = overridePrimaryColor(toggleAnim, BLACK);

type ProfileProps = {
  open: boolean;
  startRect: DOMRect | null;
  onClose: () => void;
  automationCount: number;
  onAutomationsOpen: () => void;
};

type Activity = { emoji: React.ReactNode; tone: string; label: string; sub: string; value: string; highlight?: boolean };

const STATS = [
  { value: '8', label: 'שכנים שעזרת' },
  { value: '14', label: 'אירועים' },
  { value: '23', label: 'הצבעות' },
];

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 500 500" aria-hidden="true">
      <path fill="#121330" d="M401.02 83.362h-52.076V57.324c0-8.54-7.082-15.622-15.622-15.622s-15.623 7.082-15.623 15.622v26.038H182.304V57.324c0-8.54-7.082-15.622-15.622-15.622s-15.623 7.082-15.623 15.622v26.038H98.984c-19.996 0-36.452 16.456-36.452 36.452V401.02c0 19.997 16.456 36.453 36.452 36.453H401.02c19.997 0 36.453-16.456 36.453-36.453V119.814c0-19.996-16.456-36.452-36.453-36.452M98.983 114.607H401.02c2.917 0 5.208 2.291 5.208 5.207v46.868H93.777v-46.868c0-2.916 2.291-5.207 5.207-5.207m302.035 291.62H98.984c-2.916 0-5.207-2.291-5.207-5.208V197.927h312.45v203.092c0 2.917-2.291 5.208-5.208 5.208"/>
      <path fill="#121330" d="M166.682 250.002c-11.456 0-20.83 9.373-20.83 20.83s9.374 20.83 20.83 20.83h.208c11.457 0 20.83-9.374 20.83-20.83-.208-11.457-9.581-20.83-21.038-20.83m83.32 0c-11.665 0-20.83 9.373-20.83 20.83s9.373 20.83 20.83 20.83 20.83-9.374 20.83-20.83c0-11.457-9.165-20.83-20.83-20.83m83.32 0c-11.665 0-20.83 9.373-20.83 20.83s9.373 20.83 20.83 20.83 20.83-9.374 20.83-20.83c0-11.457-9.374-20.83-20.83-20.83m-166.64 72.905c-11.456 0-20.83 9.373-20.83 20.83s9.374 20.83 20.83 20.83h.208c11.457 0 20.83-9.374 20.83-20.83-.208-11.457-9.581-20.83-21.038-20.83m83.32 0c-11.665 0-20.83 9.373-20.83 20.83s9.373 20.83 20.83 20.83 20.83-9.374 20.83-20.83c0-11.457-9.165-20.83-20.83-20.83"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 500 500" aria-hidden="true">
      <path fill="#121330" d="m424.048 339.888-6.483-5.665c13.084-26.011 19.956-54.866 19.956-84.22s-6.873-58.208-19.956-84.219l6.482-5.665a15.65 15.65 0 0 0 3.003-20.028c-16.808-27.118-40.025-50.335-67.14-67.141a15.65 15.65 0 0 0-20.028 3.003l-5.66 6.476C308.21 69.345 279.354 62.473 250 62.473c-29.351 0-58.207 6.872-84.226 19.955l-5.66-6.475c-5.041-5.767-13.516-7.041-20.027-3.003-27.116 16.806-50.333 40.023-67.142 67.141a15.65 15.65 0 0 0 3.003 20.028l6.478 5.662c-13.084 26.012-19.956 54.868-19.956 84.222s6.872 58.21 19.956 84.222l-6.478 5.662a15.65 15.65 0 0 0-3.003 20.028c16.81 27.119 40.027 50.335 67.142 67.14a15.6 15.6 0 0 0 8.236 2.349c4.391 0 8.727-1.845 11.791-5.351l5.66-6.476c26.019 13.083 54.875 19.956 84.226 19.956 29.354 0 58.211-6.873 84.224-19.957l5.665 6.478a15.64 15.64 0 0 0 11.789 5.349c2.83 0 5.683-.766 8.235-2.347 27.103-16.793 50.319-40.009 67.138-67.137a15.65 15.65 0 0 0-3.003-20.031m-17.828-89.885c0 21.727-4.509 43.121-13.151 62.808l-42.279-36.959q.242-.977.471-1.99c1.943-7.616 2.929-15.642 2.929-23.859s-.986-16.244-2.929-23.86a92 92 0 0 0-.472-1.994l42.265-36.941a156.3 156.3 0 0 1 13.166 62.795m-130.717 67.994q-.485.176-.957.383c-2.091.917-4.615 1.695-7.719 2.382q-.268.06-.534.129c-5.066 1.31-10.7 2.002-16.293 2.002-5.673 0-11.154-.674-16.293-2.002a17 17 0 0 0-.534-.129c-3.104-.687-5.638-1.468-7.744-2.389a16 16 0 0 0-.845-.337c-.032-.012-.06-.029-.092-.04a70.8 70.8 0 0 1-23.246-13.906 70.7 70.7 0 0 1-19.24-28.584 16 16 0 0 0-.383-.957c-.917-2.091-1.696-4.616-2.383-7.719q-.06-.268-.128-.534c-1.311-5.066-2.002-10.7-2.002-16.293 0-5.672.673-11.154 2.002-16.293q.068-.267.128-.535c.687-3.103 1.466-5.628 2.383-7.719q.207-.471.383-.956a70.7 70.7 0 0 1 21.678-30.658 70.9 70.9 0 0 1 20.809-11.834l.06-.026q.443-.161.876-.349c2.106-.921 4.64-1.703 7.744-2.39q.268-.06.534-.128c5.139-1.328 10.62-2.002 16.293-2.002 5.593 0 11.227.692 16.293 2.002q.266.068.534.128c3.104.687 5.628 1.466 7.719 2.383q.472.207.957.382c19.826 7.179 35.312 22.665 42.487 42.487.008.022.02.044.028.066q.166.453.359.895c.917 2.091 1.696 4.616 2.383 7.719q.06.268.128.535c1.329 5.139 2.002 10.621 2.002 16.293 0 5.593-.691 11.227-2.002 16.293q-.069.266-.128.534c-.687 3.103-1.466 5.628-2.383 7.719q-.207.472-.383.957c-7.177 19.826-22.665 35.313-42.491 42.491m117.563-172.37-5.741 5.018-.092.08-49.515 43.278-.135-.208c-.323-.508-.654-1.01-.985-1.512-.183-.277-.362-.556-.547-.831q-.52-.765-1.051-1.52c-.182-.259-.361-.522-.545-.779a101 101 0 0 0-1.127-1.538c-.176-.237-.348-.475-.526-.71-.404-.534-.818-1.061-1.232-1.587-.161-.204-.318-.411-.481-.614q-.67-.833-1.358-1.652-.207-.252-.416-.502a101 101 0 0 0-1.576-1.812l-.252-.288a102 102 0 0 0-7.932-7.932q-.175-.155-.352-.308a101 101 0 0 0-1.747-1.52c-.185-.157-.375-.309-.561-.464-.526-.439-1.053-.878-1.589-1.307-.226-.181-.457-.356-.685-.535-.503-.396-1.006-.792-1.516-1.178-.253-.192-.511-.378-.766-.567q-.736-.55-1.483-1.087c-.275-.197-.555-.388-.832-.582q-.727-.512-1.463-1.011c-.293-.198-.592-.389-.887-.584q-.724-.48-1.458-.949l-.22-.143 48.378-55.35a178 178 0 0 1 38.692 38.694M250 93.773c21.725 0 43.111 4.527 62.797 13.167l-36.948 42.273a99 99 0 0 0-1.99-.471c-7.616-1.944-15.642-2.929-23.859-2.929s-16.243.985-23.859 2.929q-1.014.228-1.993.471l-36.949-42.273A156.3 156.3 0 0 1 250 93.773m-104.378 13.16 4.88 5.584q.11.127.221.252L194 162.283l-.193.125q-.786.501-1.561 1.016-.397.26-.791.522-.776.525-1.542 1.065c-.253.178-.509.352-.761.532-.514.367-1.021.744-1.527 1.12-.243.181-.489.357-.73.54-.509.385-1.01.78-1.511 1.174q-.35.271-.696.545c-.511.409-1.014.828-1.517 1.247-.213.177-.428.35-.639.529q-.786.67-1.559 1.355c-.181.16-.366.317-.546.478q-.858.773-1.7 1.563-.177.162-.353.326a102 102 0 0 0-3.946 3.945c-.223.235-.438.477-.659.715-.409.44-.819.879-1.22 1.326-.284.317-.559.641-.839.961-.328.376-.659.749-.982 1.129-.302.356-.596.719-.893 1.079-.292.354-.588.706-.875 1.064-.306.381-.603.77-.904 1.156-.268.344-.538.685-.802 1.033-.307.405-.606.816-.907 1.226q-.374.504-.742 1.012c-.303.423-.598.852-.894 1.279-.232.335-.467.668-.695 1.006q-.444.661-.877 1.33c-.217.333-.436.663-.65.999q-.106.16-.211.323l-55.349-48.376a178 178 0 0 1 38.693-38.694m-51.851 143.07c0-21.725 4.527-43.111 13.167-62.798l42.272 36.947a98 98 0 0 0-.471 1.991c-1.943 7.616-2.929 15.643-2.929 23.86s.986 16.243 2.929 23.859q.229 1.014.471 1.991L106.938 312.8a156.3 156.3 0 0 1-13.167-62.797m13.158 104.376 55.349-48.377.204.313c.223.351.453.697.68 1.045.281.43.561.861.848 1.286q.36.528.727 1.051c.286.413.57.827.862 1.235.255.357.518.707.778 1.06.289.393.576.789.871 1.178.276.364.56.722.841 1.082.289.37.574.743.868 1.109.301.375.609.743.915 1.113.284.344.564.691.852 1.031.342.404.693.8 1.042 1.198.26.297.516.597.779.891.441.492.892.976 1.342 1.459.18.193.355.39.536.581a101 101 0 0 0 3.957 3.957l.21.194q.912.86 1.845 1.697c.144.129.291.252.435.38.552.489 1.107.976 1.67 1.453.182.154.367.302.55.455.533.445 1.066.888 1.608 1.322.202.162.409.319.612.479.529.417 1.059.833 1.597 1.24q.326.243.653.484.797.596 1.606 1.177c.226.161.456.317.683.477.537.377 1.076.754 1.621 1.121.238.16.479.315.718.473q.812.54 1.635 1.064l.177.115-43.281 49.518-.104.12-4.993 5.712a178 178 0 0 1-38.693-38.693M250 406.233a156.3 156.3 0 0 1-62.801-13.168l36.948-42.273q.98.243 1.994.471c7.616 1.944 15.642 2.93 23.859 2.93s16.243-.986 23.859-2.93a98 98 0 0 0 1.989-.47l36.963 42.288c-19.688 8.643-41.082 13.152-62.811 13.152m104.377-13.159-4.856-5.553-.001-.002-43.524-49.795c.086-.054.169-.112.255-.166.435-.276.865-.56 1.295-.843.35-.23.703-.458 1.05-.692q.642-.437 1.277-.882c.34-.237.681-.471 1.018-.712.425-.304.844-.616 1.264-.927.328-.243.66-.482.985-.728.422-.32.838-.649 1.255-.975.315-.246.632-.489.944-.739.426-.341.844-.691 1.264-1.039.295-.244.593-.485.885-.733q.661-.564 1.313-1.141c.261-.229.526-.454.785-.686.494-.443.98-.896 1.465-1.348.193-.18.39-.355.581-.536a101 101 0 0 0 3.944-3.944c.159-.168.312-.341.47-.51.475-.509.95-1.019 1.415-1.538.213-.238.42-.483.631-.723.401-.457.805-.912 1.198-1.376.231-.272.455-.551.683-.826.365-.44.731-.879 1.089-1.325.235-.293.464-.592.696-.888.341-.436.684-.87 1.018-1.311.237-.312.467-.631.7-.946.32-.432.641-.863.954-1.301.234-.328.461-.66.692-.991q.455-.648.901-1.304c.232-.344.457-.691.685-1.038.284-.432.569-.863.846-1.3l.167-.256 49.789 43.525.002.002 5.555 4.855a177.9 177.9 0 0 1-38.69 38.692"/>
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 500 500" aria-hidden="true">
      <g>
        <path fill="#121330" d="M213.55 322.907h-93.736c-8.54 0-15.622 7.082-15.622 15.622s7.082 15.623 15.622 15.623h93.735c8.54 0 15.623-7.082 15.623-15.623 0-8.54-7.082-15.622-15.623-15.622m93.735 0H276.04c-8.54 0-15.622 7.082-15.622 15.622s7.082 15.623 15.622 15.623h31.245c8.54 0 15.623-7.082 15.623-15.623 0-8.54-7.082-15.622-15.623-15.622"/>
        <path fill="#121330" d="M421.85 83.362H78.153c-20.205 0-36.452 16.456-36.452 36.452V380.19c0 19.997 16.247 36.453 36.452 36.453H421.85c19.997 0 36.453-16.456 36.453-36.453V119.814c0-19.996-16.247-36.452-36.453-36.452M78.153 114.607H421.85c2.917 0 5.208 2.291 5.208 5.207v46.868H72.947v-46.868c0-2.916 2.291-5.207 5.207-5.207m348.903 124.98H72.947v-41.66h354.11zm-5.208 145.81H78.154c-2.916 0-5.207-2.291-5.207-5.208V270.832h354.11v109.357c0 2.917-2.291 5.208-5.208 5.208"/>
      </g>
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#121331" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 25 24" aria-hidden="true">
      <g stroke="#121331" clipPath="url(#build-icon-clip)">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.23 12.55a5.15 5.15 0 0 1-4.8 1.39L8.7 19.67c-.78.78-2.05.78-2.83 0l-1.04-1.04c-.78-.78-.78-2.05 0-2.83l5.73-5.73c-.39-1.67.09-3.5 1.39-4.8a5.16 5.16 0 0 1 6.16-.88l-4.03 4.03 2.05 2.05 4.02-4.02c1.06 1.95.75 4.44-.91 6.1z" />
        <circle cx="7.5" cy="17" r=".5" fill="#121331" />
      </g>
      <defs>
        <clipPath id="build-icon-clip">
          <path fill="#fff" d="M.5 0h24v24H.5z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function AutomationIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M8.5 7h4.25A3.25 3.25 0 0 1 16 10.25v4.25" />
      <path d="m13.5 12 2.5 2.5 2.5-2.5" />
    </svg>
  );
}

const ACTIVITY: Activity[] = [
  { emoji: <CalendarIcon />, tone: 'blue', label: 'האירועים שלי', sub: 'הבא: שוק איכרים, יום א׳', value: '3 קרובים' },
  { emoji: <UsersIcon />, tone: 'pink', label: 'ההתנדבויות שלי', sub: 'תיקון חשמל לרחל', value: '1 פעילה' },
  { emoji: <CreditCardIcon />, tone: 'orange', label: 'תשלום לוועד', sub: 'דמי ועד · יוני', value: '₪120 לתשלום', highlight: true },
  { emoji: <PackageIcon />, tone: 'purple', label: 'חבילות', sub: 'ממתינה בלוקר השכונתי', value: '1 ממתינה' },
  { emoji: <BuildIcon />, tone: 'lime', label: 'דיווחי תקלות', sub: 'תאורה ברחוב האלון', value: '1 בטיפול' },
];

const DEFAULT_IDENTITY: IdentityData = {
  name: 'טל לוינסקי',
  street: 'רחוב האלון',
  neighborhood: 'גבעת אלה',
};

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export default function Profile({
  open,
  startRect,
  onClose,
  automationCount,
  onAutomationsOpen,
}: ProfileProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [publicOpen, setPublicOpen] = useState(false);
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [identity, setIdentity] = useState<IdentityData>(DEFAULT_IDENTITY);
  const [interestIds, setInterestIds] = useState<string[]>(DEFAULT_INTEREST_IDS);
  const [avatarPhotoUrl, setAvatarPhotoUrl] = useState<string | null>(null);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const notifyToggleRef = useRef<LottieRefCurrentProps>(null);

  const handleNotificationsToggle = () => {
    const anim = notifyToggleRef.current;
    const next = !notificationsOn;
    setNotificationsOn(next);
    if (!anim) return;
    anim.setDirection(1);
    // morph-select runs off→selected(≈170)→off(200); play the half that matches the new state
    if (next) {
      anim.playSegments([140, 170], true); // slide to selected and hold
    } else {
      anim.playSegments([170, 200], true); // slide back to the default state
    }
  };

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      return;
    }
    if (!render) return;
    flipAvatarToStart();
    setVisible(false);
    setClosing(true);
    const t = setTimeout(() => {
      setRender(false);
      setClosing(false);
      setPublicOpen(false);
      setInterestsOpen(false);
      setAvatarOpen(false);
    }, 480);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (avatarPhotoUrl) URL.revokeObjectURL(avatarPhotoUrl);
    };
  }, [avatarPhotoUrl]);

  const locationLabel = `${identity.street} · ${identity.neighborhood}`;

  const handlePhotoSelected = (file: File) => {
    setAvatarPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  // Map the big avatar back onto the small header avatar (used on close)
  const flipAvatarToStart = () => {
    const el = avatarRef.current;
    if (!el || !startRect) return;
    const last = el.getBoundingClientRect();
    const dx = startRect.left - last.left;
    const dy = startRect.top - last.top;
    const scale = startRect.width / last.width;
    el.style.transformOrigin = 'top left';
    el.style.transition = '';
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
  };

  // FLIP: start the big avatar at the header position, then release to grow into place
  useLayoutEffect(() => {
    if (!render) return;
    const el = avatarRef.current;
    if (el && startRect) {
      const last = el.getBoundingClientRect();
      const dx = startRect.left - last.left;
      const dy = startRect.top - last.top;
      const scale = startRect.width / last.width;
      el.style.transformOrigin = 'top left';
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      void el.offsetHeight; // force reflow
      el.style.transition = '';
      el.style.transform = '';
    }
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onClose]);

  if (!render) return null;

  return (
    <div
      className={`profile${visible ? ' is-open' : ''}${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-label="הפרופיל שלי"
      dir="rtl"
    >
      <div className="profile-bg" />

      <div className="profile-top">
        <IconButton ariaLabel="סגירה" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <span className="profile-top-title">ההגדרות שלי</span>
      </div>

      <div className="profile-scroll">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar" ref={avatarRef}>
            {avatarPhotoUrl ? (
              <img src={avatarPhotoUrl} alt="" className="profile-avatar-photo" />
            ) : (
              <Lottie
                animationData={avatarAnim}
                loop={false}
                autoplay
                className="profile-avatar-lottie"
              />
            )}
            <span className="profile-avatar-verified" aria-hidden="true">✓</span>
          </div>
          <button
            type="button"
            className="profile-avatar-edit"
            onClick={() => setAvatarOpen(true)}
            aria-label="שינוי תמונת פרופיל"
          >
            <PencilIcon />
          </button>
        </div>

        <div className="profile-reveal profile-identity">
          <h1 className="profile-name text-h2-bold">{identity.name}</h1>
          <p className="profile-sub text-small-normal">{locationLabel}</p>
          <button
            type="button"
            className="btn-secondary profile-public-cta"
            onClick={() => setPublicOpen(true)}
          >
            תצוגה מקדימה של הפרופיל שלי
          </button>
        </div>

        <div className="profile-reveal profile-stats">
          {STATS.map((s, i) => (
            <div className="profile-stat" key={s.label}>
              {i > 0 && <span className="profile-stat-divider" aria-hidden="true" />}
              <span className="profile-stat-value text-h2-bold">{s.value}</span>
              <span className="profile-stat-label text-tiny-normal">{s.label}</span>
            </div>
          ))}
        </div>


        <section className="profile-reveal profile-block">
          <h2 className="profile-block-title text-medium-bold">הפעילות שלי</h2>
          <div className="profile-list">
            {ACTIVITY.map((a) => (
              <button type="button" className="profile-row" key={a.label}>
                <span className={`profile-row-icon tone-${a.tone}`} aria-hidden="true">{a.emoji}</span>
                <span className="profile-row-text">
                  <span className="profile-row-label text-small-bold">{a.label}</span>
                  <span className="profile-row-sub text-tiny-normal">{a.sub}</span>
                </span>
                <span className={`profile-row-value text-tiny-bold${a.highlight ? ' is-highlight' : ''}`}>
                  {a.value}
                </span>
                <span className="profile-row-arrow" aria-hidden="true"><ChevronIcon /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="profile-reveal profile-block">
          <h2 className="profile-block-title text-medium-bold">כלים חכמים</h2>
          <button
            type="button"
            className="profile-automation-card"
            data-hook="profile-automations"
            onClick={onAutomationsOpen}
          >
            <span className="profile-automation-icon" aria-hidden="true">
              <AutomationIcon />
            </span>
            <span className="profile-row-text">
              <span className="profile-row-label text-small-bold">האוטומציות שלי</span>
              <span className="profile-row-sub text-tiny-normal">
                ניהול התראות ופעולות אוטומטיות
              </span>
            </span>
            <span className="profile-row-value text-tiny-bold">
              {automationCount === 1 ? '1 פעילה' : `${automationCount} פעילות`}
            </span>
            <span className="profile-row-arrow" aria-hidden="true">
              <ChevronIcon />
            </span>
          </button>
        </section>

        <section className="profile-reveal profile-block">
          <h2 className="profile-block-title text-medium-bold">
            <svg className="profile-block-title-icon" viewBox="0 0 500 500" fill="currentColor" aria-hidden="true">
              <path d="M317.707 83.311H182.289c-77.555 0-140.65 63.095-140.65 140.65v135.418c0 31.604 25.712 57.316 57.316 57.316h6.46c21.385 0 41.787-6.769 59.003-19.578 17.212-12.806 29.581-30.416 35.787-50.982l10.005-33.607h79.576l10.022 33.663c6.189 20.51 18.558 38.12 35.77 50.926 17.216 12.809 37.618 19.578 59.003 19.578h6.459c31.604 0 57.317-25.712 57.317-57.316V223.961c0-77.555-63.095-140.65-140.65-140.65m109.35 276.068c0 14.346-11.671 26.016-26.017 26.016h-6.459c-29.586 0-56.235-19.84-64.792-48.191l-13.334-44.791a15.65 15.65 0 0 0-14.999-11.185H198.54a15.65 15.65 0 0 0-14.999 11.185l-13.317 44.735c-8.573 28.407-35.223 48.247-64.809 48.247h-6.46c-14.346 0-26.016-11.67-26.016-26.016V223.961c0-60.296 49.054-109.35 109.35-109.35h135.418c60.296 0 109.35 49.054 109.35 109.35z" />
              <path d="M192.708 192.684h-10.394V182.29c0-8.643-7.006-15.65-15.65-15.65s-15.65 7.007-15.65 15.65v10.394H140.62c-8.644 0-15.65 7.007-15.65 15.65s7.006 15.65 15.65 15.65h10.394v10.394c0 8.643 7.006 15.65 15.65 15.65s15.65-7.007 15.65-15.65v-10.394h10.394c8.644 0 15.65-7.007 15.65-15.65s-7.006-15.65-15.65-15.65m119.052 32.472c-.13-.65-.291-1.3-.491-1.94-.189-.64-.419-1.28-.679-1.89-.25-.62-.54-1.23-.85-1.82-.32-.59-.66-1.17-1.03-1.72q-.555-.84-1.2-1.62c-.42-.52-.88-1.02-1.35-1.5-.471-.47-.98-.93-1.5-1.35a19.6 19.6 0 0 0-3.341-2.22c-.59-.32-1.199-.61-1.809-.86-.62-.26-1.26-.48-1.89-.68-.641-.19-1.301-.36-1.95-.49-.66-.13-1.32-.23-1.99-.3a21 21 0 0 0-4.031 0c-.67.07-1.33.17-1.989.3-.65.13-1.31.3-1.95.49-.63.2-1.271.42-1.891.68-.609.25-1.219.54-1.809.86-.59.31-1.17.66-1.73 1.02-.551.37-1.1.78-1.61 1.2-.521.42-1.03.88-1.5 1.35-.48.48-.929.98-1.36 1.5a21 21 0 0 0-2.22 3.34c-.31.59-.6 1.2-.861 1.82-.25.61-.479 1.25-.669 1.89-.2.64-.36 1.29-.491 1.94-.14.66-.239 1.33-.3 1.99-.069.67-.109 1.35-.109 2.02s.04 1.35.109 2.01c.061.67.16 1.34.3 1.99.131.66.291 1.31.491 1.95.19.64.419 1.27.669 1.89a22 22 0 0 0 1.891 3.54c.37.56.77 1.1 1.19 1.62.431.52.88 1.02 1.36 1.49.47.48.979.93 1.5 1.36a20.2 20.2 0 0 0 3.34 2.22c.59.31 1.2.6 1.809.86.62.25 1.261.48 1.891.68.64.19 1.3.36 1.95.49.659.13 1.33.23 1.989.3.67.07 1.351.1 2.021.1.66 0 1.34-.03 2.01-.1s1.33-.17 1.99-.3c.649-.13 1.309-.3 1.95-.49.63-.2 1.27-.43 1.89-.68.61-.26 1.219-.55 1.809-.86.591-.31 1.171-.66 1.721-1.03a19.5 19.5 0 0 0 3.12-2.55c.47-.47.93-.97 1.35-1.49q.645-.78 1.2-1.62c.37-.56.71-1.14 1.03-1.73.31-.58.6-1.19.85-1.81.26-.62.49-1.25.679-1.89q.298-.96.491-1.95c.14-.65.24-1.32.3-1.99.07-.66.11-1.34.11-2.01s-.04-1.35-.11-2.02c-.06-.66-.16-1.33-.3-1.99m62.51-41.659c-.13-.66-.301-1.31-.49-1.95-.2-.64-.42-1.27-.68-1.89-.25-.61-.541-1.23-.86-1.81-.311-.59-.66-1.17-1.02-1.73q-.57-.84-1.2-1.62c-.42-.52-.88-1.02-1.35-1.49-.48-.48-.98-.93-1.5-1.36a21 21 0 0 0-1.62-1.19c-.55-.37-1.13-.72-1.72-1.03s-1.2-.6-1.82-.86c-.61-.25-1.25-.48-1.89-.67-.641-.2-1.29-.36-1.94-.5-.66-.13-1.33-.23-1.99-.3-1.34-.13-2.7-.13-4.041 0-.659.07-1.33.17-1.979.3-.66.14-1.31.3-1.95.5-.64.19-1.27.42-1.89.67a21.5 21.5 0 0 0-3.54 1.89c-.561.37-1.1.77-1.62 1.19-.521.43-1.02.88-1.49 1.36-.479.47-.93.97-1.361 1.49a21 21 0 0 0-3.079 5.16c-.25.62-.48 1.25-.68 1.89-.189.64-.36 1.29-.491 1.95-.13.65-.229 1.32-.299 1.99-.069.66-.1 1.34-.1 2.01s.031 1.35.1 2.02c.07.66.169 1.33.299 1.99.131.65.302 1.3.491 1.94.2.64.43 1.28.68 1.89a20.4 20.4 0 0 0 1.89 3.54q.557.84 1.189 1.62.644.78 1.361 1.5c.47.47.969.93 1.49 1.35.52.42 1.059.83 1.62 1.2.56.36 1.14.71 1.73 1.02.58.32 1.19.61 1.81.86.62.26 1.25.48 1.89.68.64.19 1.29.36 1.95.49.649.13 1.32.23 1.979.3.67.07 1.351.1 2.021.1s1.35-.03 2.02-.1c.66-.07 1.33-.17 1.99-.3.65-.13 1.299-.3 1.94-.49.64-.2 1.28-.42 1.89-.68.62-.25 1.23-.54 1.82-.86.59-.31 1.17-.66 1.72-1.02a21.4 21.4 0 0 0 3.12-2.55c.47-.48.93-.98 1.35-1.5q.63-.78 1.2-1.62c.36-.55.709-1.13 1.02-1.72.319-.59.61-1.2.86-1.82.26-.61.48-1.25.68-1.89.189-.64.36-1.29.49-1.94.13-.66.23-1.33.299-1.99.07-.67.101-1.35.101-2.02s-.031-1.35-.101-2.01c-.069-.67-.169-1.34-.299-1.99" />
            </svg>
            תחומי העניין שלי
          </h2>
          <p className="profile-tags-note text-small-normal">
            לפי תחומי העניין נבחר לך מה להציג בעדכונים
          </p>
          <div className="profile-tags">
            {interestIds.map((id) => {
              const item = getInterestById(id);
              if (!item) return null;
              return (
                <span className="profile-tag" key={id}>
                  <span className="profile-tag-emoji" aria-hidden="true">{item.emoji}</span>
                  <span className="text-small-normal">{item.label}</span>
                </span>
              );
            })}
            <button
              type="button"
              className="profile-tag profile-tag-add text-small-bold"
              onClick={() => setInterestsOpen(true)}
            >
              + הוסף
            </button>
          </div>
        </section>

        <section className="profile-reveal profile-block">
          <h2 className="profile-block-title text-medium-bold">
            <svg className="profile-block-title-icon" viewBox="0 0 25 24" fill="none" aria-hidden="true">
              <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <path d="M12.5 2.75v2m5.46 8.92 1.79 3.58H5.25l1.79-3.58c.14-.28.21-.58.21-.89V10a5.25 5.25 0 1 1 10.5 0v2.78c0 .31.07.62.21.89m-3.21 3.58V19c0 1.24-1.01 2.25-2.25 2.25s-2.25-1.01-2.25-2.25v-1.75" />
              </g>
            </svg>
            התראות לנייד
          </h2>
          <button
            type="button"
            className="profile-notify"
            onClick={handleNotificationsToggle}
            aria-pressed={notificationsOn}
          >
            <span className="profile-notify-toggle">
              <Lottie
                lottieRef={notifyToggleRef}
                animationData={notifyToggleAnim}
                loop={false}
                autoplay={false}
                onDOMLoaded={() => notifyToggleRef.current?.goToAndStop(60, true)}
                className="profile-notify-lottie"
              />
            </span>
            <span className="profile-notify-text text-small-normal">
              אפשר לי לקבל התראות מהאפליקציה לנייד
            </span>
          </button>
        </section>
      </div>

      <InterestPicker
        open={interestsOpen}
        selectedIds={interestIds}
        onBack={() => setInterestsOpen(false)}
        onSave={setInterestIds}
      />
      <AvatarPickerSheet
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        onPhotoSelected={handlePhotoSelected}
      />
      <PublicProfile
        open={publicOpen}
        onBack={() => setPublicOpen(false)}
        name={identity.name}
        location={locationLabel}
        interestIds={interestIds}
        avatarPhotoUrl={avatarPhotoUrl}
      />
    </div>
  );
}
