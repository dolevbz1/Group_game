# Community Manager Dashboard — Roadmap

Plans for everything **not yet built** in V1.  
V1 lives at `admin.html` and covers: **תיבת פעולות**, **סוכן AI** (topic stats + advice + activity log), sidebar shell, and placeholder screens.

---

## Product model (applies to all phases)

```
WhatsApp / Email / Resident App
        ↓
    AI Agent (ingests, understands, drafts)
        ↓
   Automation layer (auto-handle vs escalate)
        ↓
   ┌─────────────────┬──────────────────────┐
   │  Auto-published  │  Needs admin review  │
   │  (resident app)  │  (admin dashboard)   │
   └─────────────────┴──────────────────────┘
```

**Default mental model for the admin:** *"What did the AI do, and what still needs me?"*

Every item in the system should show:
- **Source** — WhatsApp · Email · App · AI chat
- **AI reasoning** — why it was flagged or auto-handled
- **Confidence** — high / medium / low
- **One-tap actions** — approve, edit, dismiss, preview in residents app

---

## V1 — Done

| Area | Status |
|------|--------|
| iPad landscape shell + sidebar | ✅ |
| תיבת פעולות — metrics, source bars, automation split | ✅ |
| Inbox queue with approve / dismiss | ✅ |
| Activity heatmap | ✅ |
| סוכן AI — topic statistics (נושאים נפוצים בשאלות) | ✅ |
| סוכן AI — proactive advice (המלצות AI לפעולה) | ✅ |
| סוכן AI — activity log | ✅ |
| Placeholders: תוכן, תושבים, תובנות, הגדרות | ✅ shell only |
| Link to residents app (`index.html`) | ✅ |

---

## Phase 2 — Content (תוכן)

Mirrors the residents app **Add menu** and **carousel** — one sub-area per pillar.

### Sub-sections

| Sub-page | Resident app mirror | Admin capabilities |
|----------|---------------------|-------------------|
| עדכונים | `NewsCard`, Add → "עדכון חדש" | Published / Draft / Scheduled lists; create & edit; urgency flag; audience targeting by interests |
| הצבעות | `PollsCard`, Add → "סקר חדש" | Create poll, close poll, view live results, export |
| התנדבות | `VolunteerCard`, Add → "בקשת התנדבות" | Open requests, manual match, mark fulfilled, map view |
| אירועים | `EventsCard`, `EventsPage`, Add → "אירוע חדש" | CRUD events, RSVPs, capacity, ticket-style preview |
| מרקטפלייס | `MarketplaceCard`, `MarketplacePage`, Add → "מוצר חדש" | Moderate listings, approve/reject, categories, flag suspicious |

### UX requirements

- **Tabs per pillar:** פורסם · טיוטה · מתוזמן
- **Side-by-side preview** — how the item will look in the residents carousel
- **Shared mock data** — reuse `marketplaceListings.ts`, news/events from resident components where possible
- **Wire AI advice actions** — e.g. "צור עדכון מומלץ" on pool-hours advice opens a pre-filled news draft

### Inbox → Content flow

When admin clicks **אשר ופרסם** or **ערוך** on an inbox item, open the relevant content editor with AI-drafted fields pre-filled.

---

## Phase 3 — Residents (תושבים)

Lightweight resident overview — not a full CRM.

### Features

- **Search** by name, street, neighborhood
- **Resident card:** name, address, interests (from `interests.ts`), avatar
- **Activity summary:** events attended, polls voted, volunteer help given/received, open issues
- **Context for escalations** — e.g. "רחל שלחה 3 הודעות על תאורה" when AI flags a repeat issue
- **Link to conversation history** (WhatsApp / email / in-app) when available

### Data to surface from residents app

From `Profile.tsx` activity types:
- האירועים שלי
- ההתנדבויות שלי
- תשלום לוועד
- חבילות
- דיווחי תקלות

---

## Phase 4 — Insights (תובנות)

Analytics dashboard — extends the V1 metrics and heatmap.

### Metrics & charts

| Metric | Purpose |
|--------|---------|
| Poll participation trends | Are residents engaging with surveys? |
| Volunteer match rate | % of requests matched within 24h |
| Marketplace views & listings | Marketplace health |
| Event RSVP funnel | Registrations vs attendance |
| AI resolution rate | % handled without admin involvement |
| Topic trends over time | Extend V1 topic stats with weekly/monthly views |

### Layout ideas (reference: Flow Insights)

- Hero metrics row (reuse V1 pattern)
- Horizontal bar charts for sources and content types
- Heatmap (already in V1 — can add drill-down by week)
- Leaderboard-style cards optional (e.g. most active streets, top volunteers)

---

## Phase 5 — Settings (הגדרות)

### Community

- Community name, logo (גבעת אלה)
- Default language (Hebrew primary)

### AI automation rules

Simple toggles — examples from original plan:

| Rule | Behavior |
|------|----------|
| פרסם עדכוני שעות פתיחה אוטומטית | Auto-publish routine hour updates |
| העבר אלי כל דיווח בטיחות | Always escalate safety reports |
| אל תפרסם מרקטפלייס מעל ₪X בלי אישור | Price threshold for manual review |
| סגור סקר אוטומטית אחרי X ימים | Auto-close polls |
| התאם מתנדבים אוטומטית לפי מיומנות | Auto-match volunteers |

### Integrations (UI only in prototype)

- WhatsApp group connection status
- Email inbox connection
- Residents app sync status

### Roles (future)

- Single community manager vs committee members with limited access — decide before building permissions

---

## Phase 6 — Inbox enhancements

Build on V1 inbox:

| Feature | Description |
|---------|-------------|
| **Tabs** | הכל · דחוף · ממתין · טופל היום |
| **Filters** | By source (WhatsApp / Email / App) and type (news, poll, volunteer…) |
| **Bulk approve** | Low-risk items with high AI confidence |
| **Edit flow** | Opens content editor instead of instant publish |
| **Preview in app** | Modal or split view showing resident carousel card |
| **Handled history** | Archive of what was approved/dismissed today |

### Inbox item types (full list)

| Type | Resident example | Typical AI action | Admin action |
|------|------------------|-------------------|--------------|
| עדכון | Street closure, snake alert | Draft news card | Approve urgency, edit, publish |
| סקר | "מה נאכל בערב הורים?" | Auto-close at threshold | Review results, schedule next |
| התנדבות | דוד — computer help | Auto-match or escalate after 24h | Manual match, send reminder |
| אירוע | Community evening June 20 | Draft from email invite | Approve, set capacity |
| מרקטפלייס | Kids bike listing | Auto-publish or flag | Moderate, remove |
| שאילתת AI | Pool hours question | Auto-answer from knowledge | Review if AI was wrong |
| תשלום / חבילה / תקלה | From profile activity | Route to handler | Resolve, mark done |

---

## Phase 7 — AI Agent enhancements

Build on V1 topic stats + advice:

| Feature | Description |
|---------|-------------|
| **Advice → action** | "צור עדכון מומלץ" opens pre-filled news editor |
| **Confidence breakdown** | Chart: high / medium / low confidence decisions |
| **Unanswered questions** | AI fallback messages needing human-written answers |
| **Topic trends** | Week-over-week comparison per topic |
| **Suggested FAQ** | AI proposes permanent answers for recurring topics |
| **Rules panel** | Same toggles as Settings, surfaced in AI section for quick access |

### AI voice in UI

Recommended tone: **helpful but neutral** — e.g. "34 תושבים שאלו… מומלץ לפרסם עדכון" rather than first-person "אני חושב ש…"

---

## Phase 8 — Quick actions & infrastructure (admin side)

Residents app **Quick Actions** (`QuickActions.tsx`) — admin visibility/control:

| Resident action | Admin need |
|-----------------|------------|
| פתיחת שער | Log / anomalies (optional) |
| הרשמה לאירוע | RSVP management in Events |
| שיחת חירום | Escalation alert (high priority inbox) |
| הצבעות | Link to Polls content |
| סטטוס חבילות | Package status overview per resident |
| תשלום לוועד | Payment dashboard (heavy — defer or integrate external) |

**Defer in early phases:** Full billing, gate hardware control, deep access control.

---

## Explicitly out of scope (for now)

- Full committee payment / billing management
- Deep gate / access control systems
- Complex role-based permissions (until persona is defined)
- Full WhatsApp or email client inside the dashboard
- Real backend / API — prototype stays mock-data driven until product is validated

---

## Technical notes for future builds

- **Entry:** `admin.html` → `src/admin/main.tsx` (multi-page Vite setup in `vite.config.ts`)
- **Shared assets:** `src/index.css` typography, `src/admin/data/adminMockData.ts` for prototype data
- **Frame:** iPad landscape ~1180×820; full-width on narrow screens
- **RTL Hebrew** throughout
- **Visual language:** Same pastel section colors as carousel (`#D8C5FF` polls, `#FFC9D9` volunteer, `#CEFF7E` news, `#C3ECF6` events, `#FFD4A8` marketplace)
- **Residents preview:** Link to `/` or embedded phone frame

---

## Suggested build order

1. ~~Shell + Inbox + AI Agent (V1)~~ ✅  
2. **Content — עדכונים** first (highest value; connects to AI advice)  
3. Wire **advice actions → content drafts**  
4. Content — remaining pillars (events, polls, volunteer, marketplace)  
5. Inbox tabs, filters, bulk approve  
6. Residents search + activity  
7. Insights charts  
8. Settings + AI rules  
9. Integrations UI (if needed for demo)

---

## Open product decisions (unresolved)

1. **Admin persona** — one community manager, or committee with limited roles?
2. **Language** — Hebrew only, or bilingual labels?
3. **AI tone** — neutral recommendations vs conversational agent voice?
4. **Payment / gate** — show read-only status in admin, or full management?

---

*Last updated: June 2026 — after V1 delivery*
