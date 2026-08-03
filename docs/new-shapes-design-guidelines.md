# New Shapes Design Guidelines

**Version:** 1.0  
**Source of truth:** `src/new_shapes/`  
**Intended use:** Apply these guidelines to the Community Manager Admin Dashboard and any future COLBO surfaces so both products share one visual language.

---

## 1. Purpose & scope

This document defines the visual design system used in the **New Shapes** resident app. It is written to be portable: tokens, patterns, and component rules here should be adopted by the admin dashboard without re-inventing styles.

**In scope**
- Typography (Pangea + COLBO)
- Color, spacing, radius, elevation
- Component anatomy and interaction patterns
- RTL / Hebrew layout rules
- Motion and accessibility

**Out of scope (for now)**
- Admin-specific information architecture
- Data tables, bulk actions, or desktop-only layouts

**Canonical token file:** `src/new_shapes/index.css`

---

## 2. Design principles

| Principle | Definition | Application |
|-----------|------------|-------------|
| **Warm clarity** | Friendly community tone with strong hierarchy | Use soft surfaces, bold COLBO titles, readable Pangea body |
| **Domain color** | Each product area has one accent + one soft tint | Polls = blue, Volunteer = orange, Events = yellow, Marketplace = green, News = sky blue |
| **Ink-first** | Primary text and borders use one near-black | `#222233` — never pure black for UI chrome |
| **Touch-first** | Minimum interactive target 44×44px | Buttons, icon buttons, avatars |
| **RTL-native** | Hebrew is the default reading direction | Right-align text; use logical CSS properties |
| **Soft elevation** | Depth via shadow + inset highlight, not heavy borders | Standard card shadow pattern (see §6) |

---

## 3. Typography

### 3.1 Font families

#### Pangea — UI & body text
- **Family:** `'Pangea', sans-serif`
- **Role:** Body copy, labels, buttons, metadata, form fields
- **Applied on:** `body`, inherited by `input`, `textarea`, `select`, `button`
- **Hebrew support:** Automatic via `unicode-range: U+0590-05FF, U+FB1D-FB4E` — no separate font-family switch needed for Hebrew characters
- **Available weights:** 300, 400, 500, 600, 700 (+ italics)

#### COLBO — Display & emphasis
- **Family:** `'COLBO', sans-serif`
- **Role:** Section titles, carousel card headers, nav labels, large names, stat emphasis
- **Default display recipe:**
  ```css
  font-family: 'COLBO', sans-serif;
  font-weight: 700;
  font-stretch: expanded;
  letter-spacing: 0.02em;
  ```
- **Available weights:** 300, 400, 700, 800, 900
- **Available stretches:** condensed, semi-condensed, semi-expanded, expanded
- **Default stretch for UI:** `expanded`

#### COLBO Dingbat
- **Family:** `'COLBO Dingbat'`
- **Role:** Decorative glyphs only — not for readable text

### 3.2 When to use which font

| Context | Font | Class / style |
|---------|------|---------------|
| Page greeting, body paragraphs | Pangea | `.text-medium-normal` |
| Card metadata, timestamps | Pangea | `.text-small-normal` + `--color-secondary` |
| Section labels, chips | Pangea | `.text-tiny-normal` or `.text-small-bold` |
| Carousel / domain card title | COLBO 32px expanded 700 | Custom + `.text-h1-bold` size override |
| News section subtitle (“עדכונים חשובים”) | COLBO 28px expanded 700 | `.news-section-subtitle` |
| Page overlay title (Profile, AI Bot) | COLBO 24px expanded 700 | Match `.text-h2-bold` + COLBO |
| Profile name | COLBO 32px expanded 700 | — |
| Bottom nav tab label | COLBO 16px expanded 400 | `.text-tiny-normal` override |
| Event date number | COLBO 36px expanded | — |
| Stat display number | Pangea 48px bold | `--font-size-display` |

**Rule:** If it is a **section name** or **brand moment**, use COLBO. If it is **functional UI text**, use Pangea.

### 3.3 Semantic weight tokens

| Token | CSS value | Maps to | Use for |
|-------|-----------|---------|---------|
| `--font-weight-thin` | 400 | Pangea Regular | De-emphasized labels |
| `--font-weight-normal` | 500 | Pangea Medium | Body, secondary buttons |
| `--font-weight-bold` | 700 | Pangea Bold | Titles, CTAs, emphasis |

> **Note:** “Normal” in this system is Medium (500), not Regular (400). This matches WDS “normal” weight mapping.

### 3.4 Body type scale

| Token | Size | Line height | Ratio | Utility classes |
|-------|------|-------------|-------|-----------------|
| `--font-size-tiny` | 12px | 17px | ~140% | `.text-tiny-thin` / `-normal` / `-bold` |
| `--font-size-small` | 14px | 20px | ~140% | `.text-small-thin` / `-normal` / `-bold` |
| `--font-size-medium` | 16px | 22px | ~140% | `.text-medium-thin` / `-normal` / `-bold` |
| `--font-size-display` | 48px | 1 (component) | — | Stat numbers only |

### 3.5 Heading scale (H1–H6)

| Level | Size | Line height | Utility classes |
|-------|------|-------------|-----------------|
| H1 | 32px | 45px | `.text-h1-thin` / `-normal` / `-bold` |
| H2 | 24px | 34px | `.text-h2-thin` / `-normal` / `-bold` |
| H3 | 16px | 22px | `.text-h3-thin` / `-normal` / `-bold` |
| H4 | 16px | 22px | `.text-h4-thin` / `-normal` / `-bold` |
| H5 | 10px | 14px | `.text-h5-thin` / `-normal` / `-bold` |
| H6 | 12px | 17px | `.text-h6-thin` / `-normal` / `-bold` |

Each utility class sets **size + line-height + weight** together. Do not mix a heading class with a conflicting body class.

### 3.6 Typography usage rules

1. **Always pair size with the matching utility class** — do not set raw `font-size` unless extending COLBO display styles.
2. **Secondary text** uses `--color-secondary` (`rgba(34, 34, 51, 0.6)`), not a lighter font weight alone.
3. **Clamp long titles** with `-webkit-line-clamp: 2` where used in story cards.
4. **AI search stroke** (special case): `-webkit-text-stroke: 0.4px currentColor` on COLBO search input text.

---

## 4. Color system

### 4.1 Core palette

| Token | Value | Role |
|-------|-------|------|
| `--color-new-black` | `#222233` | Primary ink, headings on light surfaces |
| `--color-card-border` | `#222233` | Borders, primary CTA fill, icon stroke |
| `--color-light-surface` | `#ffffff` | Cards, sheets, buttons on color |
| `--color-secondary` | `rgba(34, 34, 51, 0.6)` | Metadata, subtitles, kicker text |
| `--color-gray` | `rgba(34, 34, 51, 0.04)` | Subtle fills, tiles, poll track background |
| `--color-bg-top` | `#F5F5F5` | App canvas |
| `--color-bg-bottom` | `#F5F5F5` | App canvas (gradient pair) |

### 4.2 Feature accents

| Token | Hex | Soft variant | Domain |
|-------|-----|--------------|--------|
| `--color-nav-polls` | `#0061FE` | `rgba(0, 97, 254, 0.1)` | Polls / voting |
| `--color-nav-volunteer` | `#FF4208` | `rgba(255, 66, 8, 0.1)` | Volunteering |
| `--color-nav-events` | `#FFD101` | `rgba(255, 209, 1, 0.14)` | Events |
| `--color-nav-marketplace` | `#25B752` | `rgba(37, 183, 82, 0.1)` | Marketplace |
| `--color-news-blue` | `#91B3FF` | `color-mix(14%)` or component soft | News / updates |
| `--color-news-card` | `#CEFF7E` | — | Lime highlight badge |
| `--color-stat-blue` | `#C3ECF6` | — | Stat card tint |

**Soft variant rule:** Use the `--color-nav-*-soft` token for header backgrounds, CTA soft fills, and highlight card buttons. Never use full accent as a large background fill.

### 4.3 Extended palette (component-level)

Use only when no semantic token exists:

| Hex | Usage |
|-----|-------|
| `#1a1a3e` | Header icon buttons, focus rings |
| `#1a1a1a` | Hero greeting, AI search text |
| `#151414` | News note footer buttons, stat card CTA |
| `#34c759` | Success states (verified badge, AI status dot) |
| `#1f8f3e` | Success text on soft green |
| `#2d8a4e` | Marketplace price |
| `#1264a3` | News detail links |
| `#ff6b4a` | Notification dot |
| `#c62828` | Destructive actions |
| `#8e8e93` | Disabled controls |
| `#f0f0f3` | Desktop preview stage background |
| `#000000` | Device bezel only |

### 4.4 Profile & settings canvas

| Token / value | Usage |
|---------------|-------|
| `#F4F1EC` | Page canvas |
| `#E9E5DE` | Soft accent surface |
| `#B9B09F` | Accent ink / inset border |

### 4.5 Public profile tone colors

For avatars and identity chips only:

| Tone | Hex |
|------|-----|
| Lime | `#CEFF7E` |
| Pink | `#FFC9D9` |
| Purple | `#D8C5FF` |
| Blue | `#C3ECF6` |
| Orange | `#FFD4A8` |
| Beige | `#E9E5D6` |
| Coral | `#F4866B` |

### 4.6 Opacity scale on base ink `rgb(34, 34, 51)`

Use for borders, overlays, and disabled states:

`0.04` · `0.06` · `0.08` · `0.1` · `0.12` · `0.14` · `0.18` · `0.2` · `0.28` · `0.3` · `0.35` · `0.45` · `0.5` · `0.55` · `0.6` · `0.65` · `0.7` · `0.72` · `0.75`

**Preferred syntax:** `color-mix(in srgb, var(--color-card-border) 14%, transparent)`

### 4.7 Color application rules

1. **One accent per context** — assign domain color via CSS custom property (`--carousel-accent`, `--highlight-accent`).
2. **Ink on light** — primary text is `--color-new-black`, not `#000000`.
3. **On-dark text** — `#ffffff` only on filled dark buttons or photo overlays.
4. **Borders** — prefer `0.5px` or `1px` in ink or `color-mix` at 14% for subtle dividers.
5. **Do not invent new accent colors** for admin sections — map admin areas to existing domain colors or neutral ink.

---

## 5. Spacing

### 5.1 Spacing scale (SP tokens)

| Token | Value | Typical use |
|-------|-------|-------------|
| `--SP1` | 4px | Micro gaps, kicker dot spacing |
| `--SP2` | 8px | Tight stacks, story card gaps |
| `--SP3` | 12px | Card internal padding, small radius reference |
| `--SP4` | 16px | Standard card padding, grid gaps |
| `--SP5` | 20px | Screen horizontal padding, carousel side inset |
| `--SP6` | 24px | Section gaps |
| `--SP7` | 28px | — |
| `--SP8` | 32px | — |
| `--SP9` | 36px | — |
| `--SP10` | 40px | — |
| `--SP11` | 44px | Touch target height |
| `--SP12` | 48px | — |

### 5.2 Layout spacing conventions

| Area | Padding / gap |
|------|---------------|
| Screen horizontal | `var(--SP5)` (20px) |
| Header | `var(--SP3) var(--SP5)` |
| Hero section | `var(--SP3) var(--SP5) var(--SP2)` |
| Card internal | `var(--SP3)` – `var(--SP4)` |
| Section vertical gap | `var(--SP6)` |
| Button icon gap | `var(--SP2)` |
| Footer button row gap | `var(--SP2)` |

### 5.3 Safe areas

Always account for notches and home indicators:

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

Used on: headers, bottom nav, full-page overlays, sheets.

### 5.4 Spacing rules for other systems

- **Use SP tokens for margin, padding, and gap only** — not for width, height, or positioning.
- **Prefer `gap` in flex/grid** over chained margins.
- **Use logical properties:** `margin-inline`, `padding-inline`, `inset-inline-start` for RTL safety.

---

## 6. Border radius

| Value | Usage |
|-------|-------|
| `999px` / `99px` | Pills: primary/secondary buttons, chips, badges |
| `50px` | Desktop device frame |
| `38px` | Inner screen, full-page overlay on desktop |
| `24px` | Bottom/top sheets |
| `20px` | Carousel cards (outer) |
| `18px` | Carousel card header top corners |
| `var(--SP3)` (12px) | **Standard card radius** — polls, events, news notes, highlight cards |
| `14px` | Inputs, search cards, interest chips |
| `12px` | Icon buttons, avatars, tiles |
| `10px` | Date badges, photo thumbs |
| `8px` | Small visuals, note pin rings |
| `6px` | AI banner chips |
| `4px` | Small CTAs, focus rings, poll progress |
| `2px` | Progress bars, pin tabs |

**Default card radius:** `12px` (`var(--SP3)`)

---

## 7. Elevation & shadows

### 7.1 Standard card shadow

Use for most elevated surfaces (poll cards, news notes, highlight cards, stat cards):

```css
box-shadow:
  inset 0 0 0 1px color-mix(in srgb, var(--color-light-surface) 80%, transparent),
  0 8px 20px color-mix(in srgb, var(--color-card-border) 6%, transparent);
```

Alternate (fixed rgba):

```css
box-shadow:
  inset 0 0 0 1px rgba(255, 255, 255, 0.8),
  0 8px 20px rgba(34, 34, 51, 0.06);
```

### 7.2 Floating controls

```css
box-shadow: 0 4px 14px color-mix(in srgb, var(--color-card-border) 14–18%, transparent);
```

Used on: story carousel next button, back buttons, avatars.

### 7.3 Strong elevation

```css
box-shadow: 0 8px 20px rgba(34, 34, 51, 0.1–0.12);
```

### 7.4 Inset accent ring (full-page overlays)

```css
box-shadow: inset 0 0 0 2px var(--accent);
```

Used on: AI Bot, Profile, Automations, Protected Area screens.

### 7.5 Backdrop blur

| Context | Value |
|---------|-------|
| Light overlay | `backdrop-filter: blur(6px) saturate(130%)` on `rgba(255,255,255,0.15)` |
| Dark overlay | `blur(8px)` on `rgba(34,34,51,0.35–0.45)` |
| AI Bot | `blur(8px) saturate(115%)` |

### 7.6 Elevation rules

1. **Do not combine heavy border + heavy shadow** — pick shadow-first for cards.
2. **Carousel cards** use a **2px solid accent border** instead of shadow for domain identity.
3. **Inactive carousel cards** reduce opacity to `0.55`; active = `1`.

---

## 8. Layout & RTL

### 8.1 Document direction

- Root HTML may be `lang="en"` in prototype; **components set `dir="rtl"`** where Hebrew UI is shown.
- **Recommended for production:** `lang="he" dir="rtl"` on root for accessibility.

### 8.2 RTL rules

| Rule | Implementation |
|------|----------------|
| Text alignment | `text-align: right` on Hebrew content blocks |
| Horizontal flow | `direction: rtl` on story tracks, carousels |
| Flex rows | `flex-direction: row-reverse` where visual order must mirror RTL |
| Positioning | `margin-inline-start/end`, `padding-inline`, `inset-inline-start` |
| Chevrons | Explicit `dir="left"` / `dir="right"` on navigation icons |
| Story progress | `direction: ltr` on progress bar only (time flows left-to-right) |

### 8.3 Screen structure (resident app)

```
.stage
  └── .device
        └── .screen
              ├── .app-header
              ├── .hero
              └── .carousel
                    ├── .carousel-track → .carousel-card × N
                    └── .carousel-nav
```

### 8.4 Desktop preview frame (≥600px)

| Property | Value |
|----------|-------|
| Stage background | `#f0f0f3` |
| Device size | 414 × 844px |
| Bezel | `#000`, `border-radius: 50px`, `padding: 12px` |
| Inner screen radius | `38px` |

### 8.5 Admin dashboard adaptation (forward-looking)

When applying to admin:

| Resident pattern | Admin equivalent |
|------------------|------------------|
| Carousel domain card | Section panel or inbox module |
| Bottom arc nav | Left sidebar navigation |
| Hero greeting | Page title + context subtitle |
| News note card | Action / approval card |
| Domain accent | Section or source-type color |
| `SP5` horizontal padding | Main content area padding |

Keep the **same tokens**; change layout structure only.

---

## 9. Components

### 9.1 Buttons

#### Primary CTA — `.btn-cta`

| Property | Value |
|----------|-------|
| Height | 44px (56px in modals) |
| Radius | `999px` |
| Background | `var(--color-card-border)` |
| Text | `#ffffff`, `var(--font-size-medium)`, bold |
| Padding | `0 var(--SP4)` |

**Use for:** Confirm, approve, primary forward action.

#### Secondary — `.btn-secondary`

| Property | Value |
|----------|-------|
| Height | 44px |
| Radius | `999px` |
| Background | transparent |
| Border | `0.5px solid var(--color-card-border)` |
| Text | `var(--color-card-border)`, medium bold |

**Use for:** Cancel, alternate path, carousel header CTA.

#### Small rectangular CTA (in cards)

| Property | Value |
|----------|-------|
| Height | 36px (stat footer) or 44px (highlight) |
| Radius | `4px` |
| Background | `var(--accent-soft)` |
| Border | `1px solid var(--accent)` |
| Text | `var(--color-new-black)` |

#### News note footer buttons

| Variant | Background | Border | Text |
|---------|------------|--------|------|
| Secondary | transparent | `1px solid #151414` | `#151414` |
| Primary (`.--cta`) | `#151414` | `1px solid #151414` | `#ffffff` |

Height: 44px · Radius: 4px · Flex: equal width in row

### 9.2 Icon buttons

| Class | Size | Radius | Color |
|-------|------|--------|-------|
| `.icon-btn` | 44×44 | — | `#1a1a3e` |
| `.screen-icon-btn` | 44×44 | 12px | bordered, white bg |
| `.avatar` | 44×44 | 12px | gray fill, 0.5px border |

**Focus visible:** `outline: 2px solid` + `border-radius: 4px`  
**Tap highlight:** `-webkit-tap-highlight-color: transparent` on all interactives

### 9.3 Header

```
[ menu icon ] [ + ]                    [ avatar ]
     ↑ left                                ↑ right
```

| Property | Value |
|----------|-------|
| Layout | flex, space-between |
| Padding | `var(--SP3) var(--SP5)` |
| Background | transparent |
| Icon size | 44×44 touch target, 24×24 glyph for plus |

### 9.4 Hero

| Property | Value |
|----------|-------|
| Padding | `var(--SP3) var(--SP5) var(--SP2)` |
| Text align | right |
| Gap | `var(--SP2)` |
| Text color | `#1a1a1a` |

Contains AI search — primary entry point below header.

### 9.5 Carousel card (domain hub)

The primary content container. Maps 1:1 to product domains.

#### Anatomy

```
┌─────────────────────────────────────┐  ← 2px accent border, radius 20px
│ HEADER (accent-soft bg)             │  ← COLBO 32px title + optional CTA
├─────────────────────────────────────┤
│ BODY (white)                        │  ← scrollable content
│                                     │
└─────────────────────────────────────┘
```

| Part | Spec |
|------|------|
| Border | `2px solid var(--carousel-accent)` |
| Outer radius | `20px` |
| Header radius | top `18px` |
| Header padding | `var(--SP4)` |
| Header title | COLBO 32px expanded 700 |
| Body | white, `padding-top: var(--SP4)` |
| Inactive opacity | `0.55` |
| Active opacity | `1` |
| Width | `calc(100% - var(--SP5) * 2)` per card |
| Track gap | `var(--SP4)` |
| Side inset | `margin-inline: var(--SP5)` on first/last |

#### Domain modifiers

| Class | Accent |
|-------|--------|
| `.carousel-card--polls` | `--color-nav-polls` |
| `.carousel-card--volunteer` | `--color-nav-volunteer` |
| `.carousel-card--news` | `--color-news-blue` |
| `.carousel-card--events` | `--color-nav-events` |
| `.carousel-card--marketplace` | `--color-nav-marketplace` |

### 9.6 Standard content card

For in-card modules (poll, list item, stat):

| Property | Value |
|----------|-------|
| Background | `var(--color-light-surface)` |
| Radius | `var(--SP3)` (12px) |
| Border | none |
| Shadow | standard card shadow (§7.1) |
| Padding | `var(--SP3)` – `var(--SP4)` |

### 9.7 News board patterns

#### Section subtitle
- COLBO 28px expanded 700
- Example: “עדכונים חשובים”

#### Story card
- Size: 116 × 139px
- Radius: `var(--SP3)`
- RTL horizontal scroll, `scroll-snap-type: x mandatory`
- Bottom gradient overlay for title legibility
- Avatar ring: 40px, accent background

#### Stat card
- 2-column grid, `gap: var(--SP4)`
- Min height: 200px
- Display number: 48px bold
- CTA: 36px height, `#151414` fill

#### Highlight card
- Min height: 172px
- Kicker with 8px accent dot
- CTA: 44px, soft accent fill + accent border

#### News note (important update)
- Padding: `var(--SP4)`
- Radius: 12px
- Standard card shadow
- Visual icon: 56px area with Lottie or emoji
- Title: `.text-medium-bold`
- Timestamp: `.text-small-normal` + secondary color
- Footer: two equal 44px buttons (secondary + primary)

**Admin mapping:** News note ≈ inbox approval card. Reuse footer button pattern for “Approve / Edit / Dismiss”.

### 9.8 Bottom navigation

| Property | Value |
|----------|-------|
| Position | absolute bottom, `var(--SP3)` + safe area |
| Tab circle | 56×56px SVG shape |
| Icon | 32px Lottie |
| Active icon | `filter: brightness(0) invert(1)` (white) |
| Inactive icon | `filter: brightness(0)` (black) |
| Label | COLBO 16px expanded 400 |
| Nav area height | `136px + safe-area-bottom` |

### 9.9 Sheets & overlays

#### Top sheet
- Slide from top: `translateY(-105%)` → `0`
- Radius: `0 0 24px 24px`

#### Bottom sheet
- Slide from bottom: `translateY(100%)` → `0`
- Radius: `24px 24px 0 0`

#### Transition
`0.4s cubic-bezier(0.65, 0, 0.35, 1)`

#### Full-page overlay
- Fixed position, min-height top bar 76px
- Soft accent top bar, centered COLBO title
- Scroll body with safe-area bottom padding

---

## 10. Motion & interaction

### 10.1 Easing

| Name | Value | Use |
|------|-------|-----|
| Standard reveal | `cubic-bezier(0.22, 1, 0.36, 1)` | Cards, notes |
| Sheet | `cubic-bezier(0.65, 0, 0.35, 1)` | Modals, drawers |
| Entrance (Material) | `cubic-bezier(0, 0, 0.2, 1)` | Header, hero |
| Nav bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bottom nav reveal |

### 10.2 Entrance stagger (screen ready)

| Element | Delay | Duration |
|---------|-------|----------|
| Header | 0ms | 300ms |
| Hero | 150ms | 350ms |
| Carousel | 300ms | 400ms |
| Nav | 500ms | 300ms |

### 10.3 Press states

- Story card: `scale(0.98)` on active
- Highlight CTA: `scale(0.98)` on active
- Carousel inactive cards: no pointer events on body

### 10.4 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable animations; keep opacity transitions ≤150ms where needed */
}
```

Always provide a reduced-motion path for carousel, loading, news notes, and entrance animations.

---

## 11. Applying to the admin dashboard

This section defines how to port New Shapes styles without copying resident-only layout.

### 11.1 What to import as-is

1. **All `:root` tokens** from `src/new_shapes/index.css`
2. **All typography utility classes**
3. **`.btn-cta` and `.btn-secondary`**
4. **Font-face declarations** (Pangea + COLBO)
5. **Standard card shadow recipe**
6. **SP spacing scale**

### 11.2 What to adapt

| New Shapes | Admin dashboard |
|------------|-----------------|
| Carousel card | Content panel / widget card |
| 2px accent border card | Optional: left accent bar (4px) instead of full border |
| Bottom arc nav | Vertical sidebar with domain icons |
| Hero AI search | Page header + filters |
| News note stack | Inbox item card |
| Story horizontal scroll | Activity feed or media strip |
| Single-column mobile | Multi-column desktop grid |

### 11.3 Admin typography mapping

| Admin element | Class |
|---------------|-------|
| Page title | `.text-h2-bold` + COLBO expanded |
| Section title | `.text-h3-bold` or COLBO 28px |
| Card title | `.text-medium-bold` |
| Metadata (source, time) | `.text-small-normal` + `--color-secondary` |
| Badge / chip | `.text-tiny-bold` |
| Metric number | `.text-h1-bold` or display 48px |

### 11.4 Admin color mapping

| Admin concept | Color |
|---------------|-------|
| Urgent inbox item | `--color-nav-volunteer` |
| Auto-handled | `--color-nav-marketplace` |
| Needs review | `--color-nav-polls` |
| AI insight | `--color-news-blue` |
| Neutral / system | `--color-new-black` + `--color-gray` |

### 11.5 Admin component checklist

When building an admin component, verify:

- [ ] Uses SP tokens for spacing
- [ ] Uses typography utility class (not raw px)
- [ ] Primary ink is `--color-new-black`
- [ ] Secondary text uses `--color-secondary`
- [ ] Touch/click target ≥ 44px
- [ ] Card uses standard shadow or accent border — not both
- [ ] `dir="rtl"` on Hebrew containers
- [ ] Focus visible state defined
- [ ] Reduced motion respected

---

## 12. Token quick reference

### CSS custom properties (copy-paste block)

```css
:root {
  /* Typography — body */
  --font-size-tiny: 12px;
  --font-size-small: 14px;
  --font-size-medium: 16px;
  --font-size-display: 48px;
  --line-height-tiny: 17px;
  --line-height-small: 20px;
  --line-height-medium: 22px;

  /* Typography — headings */
  --font-size-h1: 32px;  --line-height-h1: 45px;
  --font-size-h2: 24px;  --line-height-h2: 34px;
  --font-size-h3: 16px;  --line-height-h3: 22px;
  --font-size-h4: 16px;  --line-height-h4: 22px;
  --font-size-h5: 10px;  --line-height-h5: 14px;
  --font-size-h6: 12px;  --line-height-h6: 17px;

  /* Weights */
  --font-weight-thin: 400;
  --font-weight-normal: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --SP1: 4px;  --SP2: 8px;  --SP3: 12px;  --SP4: 16px;
  --SP5: 20px; --SP6: 24px; --SP7: 28px; --SP8: 32px;
  --SP9: 36px; --SP10: 40px; --SP11: 44px; --SP12: 48px;

  /* Colors */
  --color-new-black: #222233;
  --color-card-border: #222233;
  --color-light-surface: #ffffff;
  --color-secondary: rgba(34, 34, 51, 0.6);
  --color-gray: rgba(34, 34, 51, 0.04);
  --color-bg-top: #F5F5F5;
  --color-bg-bottom: #F5F5F5;
  --color-news-card: #CEFF7E;
  --color-stat-blue: #C3ECF6;
  --color-news-blue: #91B3FF;
  --color-nav-polls: #0061FE;
  --color-nav-volunteer: #FF4208;
  --color-nav-events: #FFD101;
  --color-nav-marketplace: #25B752;
  --color-nav-polls-soft: rgba(0, 97, 254, 0.1);
  --color-nav-volunteer-soft: rgba(255, 66, 8, 0.1);
  --color-nav-events-soft: rgba(255, 209, 1, 0.14);
  --color-nav-marketplace-soft: rgba(37, 183, 82, 0.1);
}
```

### COLBO display mixin

```css
.colbo-display {
  font-family: 'COLBO', sans-serif;
  font-weight: 700;
  font-stretch: expanded;
  letter-spacing: 0.02em;
}
```

---

## 13. File reference

| File | Contents |
|------|----------|
| `src/new_shapes/index.css` | Tokens, typography utilities, shared buttons |
| `src/new_shapes/App.css` | Stage, device frame, screen shell |
| `src/new_shapes/components/Carousel.css` | Domain cards, bottom nav |
| `src/new_shapes/components/NewsCard.css` | Stories, stats, highlights, news notes |
| `src/new_shapes/components/Header.css` | Top bar, icon buttons, avatar |
| `src/new_shapes/components/Hero.css` | Greeting area |
| `src/new_shapes/components/PollsCard.css` | Poll module |
| `src/new_shapes/assets/COLBO_desk/` | COLBO font files |
| `Sources/Pangea_font/` | Pangea font files |

---

## 14. Changelog

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-08-03 | Initial extraction from New Shapes app for admin dashboard adoption |
