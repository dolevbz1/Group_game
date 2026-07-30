# Residents App Visual Language

## Purpose

This document describes the visual language of the resident-facing app in enough detail to reproduce it in another app or dashboard without copying individual screens blindly.

It is based on the current implementation under:

- `index.html`
- `src/index.css`
- `src/App.css`
- `src/App.tsx`
- `src/components/`
- `src/assets/`

The admin dashboard under `src/admin/` is intentionally excluded from the analysis.

`home-earthy.html` is also excluded. It is a separate visual exploration with an earthy cream, sage, and terracotta palette, and is not part of the resident React app or the Vite resident entry point.

---

## 1. Visual identity in one sentence

The residents app feels like a friendly, tactile neighborhood noticeboard: soft category pastels, white paper-like surfaces, hairline navy outlines, compact rounded geometry, expressive illustrations, and playful but controlled motion.

The design is not a conventional neutral SaaS interface. Its identity comes from combining:

1. **Warm community content** — conversational Hebrew, people, local events, favors, polls, and marketplace listings.
2. **Tactile objects** — tickets, pinned notes, tags, cards, sheets, badges, circular controls, and map pins.
3. **A strict dark outline system** — almost every important surface is defined with a thin dark navy border.
4. **Category color coding** — each major content area owns a pale pastel color.
5. **Small moments of delight** — Lottie illustrations, staggered entrances, expanding navigation circles, ticker strips, and AI rainbow effects.

---

## 2. Core design principles

### 2.1 Pastel canvases, not pastel decoration

Color is structural. The five primary categories use pastel backgrounds as complete environments rather than small accents:

- Updates / news: lime
- Volunteering: pink
- Polls: purple
- Events: blue
- Marketplace: orange

The home carousel gives each category card its color. Full-screen category experiences continue that same background color. White content cards sit inside those colored environments.

When reproducing the language, do not reduce the category colors to tiny icons or badges. They should define large regions and make the active domain immediately recognizable.

### 2.2 Thin outlines create clarity

The app relies heavily on `0.5px` dark borders. These borders provide definition without making the interface feel heavy.

The dominant border treatment is:

```css
border: 0.5px solid #222233;
```

This treatment appears on:

- Main carousel cards
- Event and marketplace tickets
- Poll cards
- Input fields
- Avatars
- Icon buttons
- Sheet controls
- Chips and badges
- Nested cards

The outline is a central part of the brand. Replacing it with shadow-only cards would make the result feel like a different product.

### 2.3 White surfaces sit inside colored contexts

White is used for actionable and readable surfaces:

- Content cards
- Inputs
- Sheets and modals
- Suggestion rows
- Image containers
- Control buttons
- Avatars

The typical composition is:

1. Neutral or category-colored page background
2. White card or control
3. Hairline navy border
4. Dark navy text
5. Optional pastel accent or status

### 2.4 Friendly, rounded, but not overly soft

The app uses rounded corners frequently, but the dark outlines and compact radii keep it graphic and structured.

The most common card radius is `12px`. Larger radii are reserved for major containers, hero areas, sheets, and the device frame. Fully rounded pills use `999px`.

### 2.5 Motion communicates hierarchy

Motion is not random decoration. It usually does one of four jobs:

- Reveal hierarchy from top to bottom
- Show that a panel belongs above the current screen
- Emphasize AI or live activity
- Make navigation feel physical

---

## 3. Typography

### 3.1 Typeface

The app uses **Pangea** for both Latin and Hebrew.

The font is declared in `src/index.css` with separate Latin and Hebrew files. Hebrew faces use a Unicode range so Hebrew characters automatically use the Hebrew cut while Latin characters use the Latin cut.

Observed font weights:

- 300 — Light
- 400 — Regular
- 500 — Medium
- 600 — SemiBold
- 700 — Bold

The practical typography tokens only expose:

- `thin` = 400
- `normal` = 500
- `bold` = 700

Important naming detail: `thin` is visually regular, not an actual thin or light weight.

### 3.2 Body type scale

| Role | Size | Line height | Typical use |
|---|---:|---:|---|
| Tiny | 12px | 17px | Metadata, timestamps, labels, helper text |
| Small | 14px | 20px | Secondary text, compact controls, navigation labels |
| Medium | 16px | 22px | Primary body text, buttons, card titles |

All standard body line heights are approximately 140%, which keeps Hebrew readable at small sizes.

### 3.3 Heading scale

| Token | Size | Line height | Typical use |
|---|---:|---:|---|
| H1 | 32px | 45px | Large hero statements |
| H2 | 24px | 34px | Main screen and card headings |
| H3 | 16px | 22px | Section headings |
| H4 | 16px | 22px | Same visual size as H3 |
| H5 | 10px | 14px | Very small display label |
| H6 | 12px | 17px | Small heading / metadata heading |

The hierarchy is intentionally compact. Most of the product lives between 12px and 24px. The app does not use many oversized display headlines.

### 3.4 Weight usage

- **700 / bold**: primary headings, key values, important labels, major CTAs
- **500 / normal**: standard UI text, tabs, body copy, secondary controls
- **400 / thin**: low-emphasis labels, secondary CTAs, conversational text

### 3.5 Typography behavior

- Hebrew is generally right-aligned.
- Text color is usually dark navy rather than pure black.
- Secondary text uses alpha variants of the same navy.
- Letter spacing is almost never used; one small uppercase-style event badge uses `0.5px`.
- Text hierarchy is created mostly through weight and opacity, not through many font sizes.

### 3.6 Portable typography specification

For a future implementation:

```css
--resident-font-family: "Pangea", sans-serif;

--resident-text-xs-size: 12px;
--resident-text-xs-line: 17px;
--resident-text-sm-size: 14px;
--resident-text-sm-line: 20px;
--resident-text-md-size: 16px;
--resident-text-md-line: 22px;

--resident-heading-lg-size: 32px;
--resident-heading-lg-line: 45px;
--resident-heading-md-size: 24px;
--resident-heading-md-line: 34px;
--resident-heading-sm-size: 16px;
--resident-heading-sm-line: 22px;

--resident-weight-regular: 400;
--resident-weight-medium: 500;
--resident-weight-bold: 700;
```

When implementing in another design system, map these roles to the closest existing typography tokens rather than creating arbitrary one-off sizes.

---

## 4. Color system

### 4.1 Foundation colors

| Role | Value | Usage |
|---|---|---|
| Primary ink | `#222233` | Borders, primary text, dark buttons, dark strips |
| Alternate ink | `#121331` / `#1A1A3E` | Inline SVGs and some header icons |
| Neutral page background | `#F5F5F5` | Main residents app background |
| Desktop preview background | `#F0F0F3` | Area around the simulated phone |
| Surface | `#FFFFFF` | Cards, sheets, controls, inputs |
| Subtle fill | `rgba(34, 34, 51, 0.04)` | Neutral card interiors and low-emphasis controls |
| Secondary text | `rgba(34, 34, 51, 0.60)` | General secondary copy |

The primary dark color is a very deep blue-purple, not black. This gives the interface a softer and more branded contrast.

### 4.2 Category palette

| Category | Color | Visual role |
|---|---|---|
| Updates / news | `#CEFF7E` | Fresh lime; active updates, winning states, “new” badges |
| Volunteering | `#FFC9D9` | Warm pink; human help and matching |
| Polls | `#D8C5FF` | Soft purple; voting and choices |
| Events | `#C3ECF6` | Pale blue; calendar and community activities |
| Marketplace | `#FFD4A8` | Warm orange; buying, selling, and objects |

These colors are all:

- High-lightness
- Low-to-medium saturation
- Designed to support dark navy text
- Friendly rather than corporate

### 4.3 Supporting colors

| Role | Value | Usage |
|---|---|---|
| Positive / online | `#34C759` | Verified states, online indicator, success |
| Positive dark text | `#1F8F3E` | Text on pale green status backgrounds |
| Attention / filter badge | `#FF6B4A` | Small alert dot |
| Marketplace positive text | `#2D8A4E` | Free-item and positive marketplace messaging |
| Link blue | `#1264A3` | Inline link treatment in news details |
| Supporting beige | `#E9E5D6` | Public-profile decorative tone |
| Supporting coral | `#F4866B` | Public-profile decorative tone |
| AI red | `#FF3B30` | AI rainbow |
| AI orange | `#FF9500` | AI rainbow |
| AI yellow | `#FFCC00` | AI rainbow |
| AI cyan | `#00C7BE` | AI rainbow |
| AI blue | `#007AFF` | AI rainbow |
| AI violet | `#AF52DE` | AI rainbow |

### 4.4 Secondary text opacity ladder

The app repeatedly uses the primary ink with different alpha values:

- `0.72` — strong secondary text
- `0.65` — supporting information
- `0.60` — default secondary token
- `0.55` — metadata and placeholders
- `0.50` — inactive labels
- `0.45` — lower-emphasis placeholders
- `0.35` — disabled or decorative information
- `0.30` — separators
- `0.18` / `0.14` / `0.12` / `0.10` / `0.08` / `0.06` / `0.04` — borders, fills, and overlays

For a portable system, consolidate these into named semantic roles instead of copying every alpha:

```css
--resident-text-primary: #222233;
--resident-text-secondary: rgba(34, 34, 51, 0.60);
--resident-text-muted: rgba(34, 34, 51, 0.55);
--resident-text-disabled: rgba(34, 34, 51, 0.35);
--resident-divider: rgba(34, 34, 51, 0.10);
--resident-fill-subtle: rgba(34, 34, 51, 0.04);
```

### 4.5 AI color language

AI is the one part of the app that breaks out of the five-category palette.

It uses:

- A six-color rainbow gradient
- Animated rainbow borders
- Rainbow text washes
- Sparkle imagery
- White cards with navy outlines

The effect communicates “intelligent / magical / active” without assigning AI a permanent solid category color.

Use the rainbow sparingly. It should identify AI moments, not become a general background treatment.

---

## 5. Spacing system

The app uses a strict 4px base scale:

| Token | Value |
|---|---:|
| SP1 | 4px |
| SP2 | 8px |
| SP3 | 12px |
| SP4 | 16px |
| SP5 | 20px |
| SP6 | 24px |
| SP7 | 28px |
| SP8 | 32px |
| SP9 | 36px |
| SP10 | 40px |
| SP11 | 44px |
| SP12 | 48px |

### Common spacing patterns

- Main horizontal page padding: `SP5` / 20px
- Card internal padding: `SP3`–`SP4` / 12–16px
- Major section gap: `SP4`–`SP6` / 16–24px
- Compact row gap: `SP2`–`SP3` / 8–12px
- Icon-to-label gap: `SP1`–`SP3` / 4–12px
- Full-screen bottom safe padding: base spacing plus `env(safe-area-inset-bottom)`
- Full-screen top safe padding: base spacing plus `env(safe-area-inset-top)`

The app feels compact but not crowded because spacing is consistent and card content is broken into small grouped rows.

---

## 6. Corner-radius system

### 6.1 Radius hierarchy

| Radius | Role |
|---:|---|
| 0px | Paper notes, edge-to-edge areas, deliberate sharp ticket/paper moments |
| 2–4px | Progress bars, tab indicators, drag handles |
| 6–8px | Tiny badges and compact decorative elements |
| 10px | Small visual blocks and date badges |
| 12px | Default control, card, avatar, and input radius |
| 14px | Search fields and slightly softer controls |
| 16px | Larger cards, suggestion rows, media blocks |
| 20px | Main carousel cards and larger containers |
| 24px | Hero blocks, profile avatar, top/bottom sheets |
| 38px | Inner phone screen clipping on desktop |
| 50px | Outer phone device frame |
| 50% | Circular avatars and icon controls |
| 999px | Pills, chips, status badges, circular nav elements |

### 6.2 Default recommendation

For a new app or dashboard:

```css
--resident-radius-xs: 4px;
--resident-radius-sm: 8px;
--resident-radius-md: 12px;
--resident-radius-lg: 16px;
--resident-radius-xl: 20px;
--resident-radius-sheet: 24px;
--resident-radius-pill: 999px;
```

Use `12px` as the default. Use `20–24px` only for major containers. Use pills only for genuinely compact statuses, filters, and chips.

---

## 7. Borders, shadows, and depth

### 7.1 Borders

The default visual edge is:

```css
0.5px solid #222233
```

This is used more often than conventional 1px neutral-gray borders.

Lighter separators use dark navy at roughly 8–14% opacity.

### 7.2 Shadows

Shadows are rare and meaningful:

- Pinned news note: `0 8px 16px rgba(34, 34, 51, 0.20)`
- Raised news detail icon: `0 8px 20px rgba(34, 34, 51, 0.10)`
- AI suggestion hover: `0 4px 14px rgba(34, 34, 51, 0.08)`
- Small highlighted pin: `0 1px 4px rgba(34, 34, 51, 0.30)`

The system is primarily **border-defined**, not shadow-defined.

### 7.3 Blur and overlays

Modal overlays use:

- White overlay around 15–50% opacity
- `backdrop-filter: blur(6px) saturate(130%)`
- Smooth 350–400ms reveal

This creates a light frosted transition instead of a dark modal scrim.

---

## 8. Layout and responsive behavior

### 8.1 Mobile-first structure

The residents app is a full-viewport mobile product:

- Width: 100%
- Height: `100dvh`
- Vertical scrolling happens inside the `.screen`
- Horizontal overflow is hidden
- Safe-area insets are respected on top and bottom controls

### 8.2 Desktop preview

At `600px` and wider, the app is presented as an iPhone-like prototype:

- Device width: `414px`
- Device height: `844px`
- Black outer frame
- Outer frame radius: `50px`
- Frame padding: `12px`
- Inner screen radius: `38px`
- Neutral preview background: `#F0F0F3`

This desktop framing is a prototype presentation treatment, not part of the residents app's product UI.

### 8.3 Home composition

The home screen is vertically structured as:

1. Compact header with 44px controls
2. Greeting and headline
3. Horizontal swipe carousel
4. Floating circular category navigation

Main content aligns to 20px side padding.

The carousel intentionally shows neighboring cards. This suggests more content and supports swipe discovery.

### 8.4 Full-screen detail pages

Events, marketplace, profile, news details, report flows, and AI conversations become complete screen layers above the home screen.

Typical full-screen structure:

1. Background matching the domain
2. Top bar with 44px back control and centered title
3. Scrollable body
4. Optional fixed footer CTA
5. Staggered content reveal

### 8.5 Sheets

The product uses both:

- **Top sheets** for quick actions and creation menus
- **Bottom sheets** for filters, avatar selection, and confirmation

Top sheets use `0 0 24px 24px`.
Bottom sheets use `24px 24px 0 0`.

---

## 9. Component grammar

### 9.1 Buttons

Primary CTA:

- Height: 44–56px depending on context
- Dark navy background
- White text
- Bold or medium label
- Usually pill-shaped in shared buttons, but sometimes 12px radius in forms and full-width flows

Secondary CTA:

- Transparent or white background
- Dark navy text
- `0.5px` navy outline
- Usually pill-shaped

Icon controls:

- Standard target: 44×44px
- White or transparent background
- 12px radius when boxed
- Dark navy icon

Disabled controls use roughly `0.35` opacity and remove active cursor behavior.

### 9.2 Cards

Default card:

- White background
- `0.5px` navy border
- 12px radius
- 12–16px padding
- Dark navy title
- Muted navy metadata

Major carousel card:

- Category-colored background
- 20px radius
- 16px padding
- Hairline navy border
- Inactive cards fade to 55% opacity and compress vertically

### 9.3 Chips and badges

- Fully rounded (`999px`)
- Horizontal padding: 8–16px
- Usually pastel or subtle gray fill
- Frequently outlined
- Used for status, filters, countdowns, match state, or compact metadata

### 9.4 Inputs

- Height: typically 44–48px
- Radius: 12–14px
- White or subtle-gray background
- Hairline navy outline
- Placeholder: navy around 45–55% opacity
- Focus often changes fill to white rather than adding a strong glow

### 9.5 Tabs

- Equal-width horizontal tabs
- Inactive color: navy at 50%
- Active color: full navy
- Active indicator: 2px dark line inset by 24px
- Icons around 22px

### 9.6 Avatars

Two avatar geometries coexist:

- Rounded square: typically 12–24px radius
- Circle: used in smaller identity contexts

Many avatars contain Lottie animations rather than static photos. They still use the same hairline border and subtle neutral fill.

### 9.7 Content metaphors

The app uses custom object-like components to make categories memorable:

- News resembles pinned paper notes
- Events resemble tickets with notches and ticker strips
- Marketplace prices resemble physical tags
- Poll results resemble rising columns
- Volunteering uses a map and match cards

When extending the app, preserve this principle: each major category may have one distinct physical metaphor, while still sharing typography, borders, colors, and spacing.

---

## 10. Navigation language

The home category navigation is one of the strongest visual signatures.

### Default state

- Circular buttons: 56×56px
- Category pastel fill
- Hairline navy outline
- Small label below inactive categories

### Active state

- Active circle expands continuously up to 108×108px
- Label is hidden
- Icon scales with the circle
- Neighboring circles shift horizontally and drop vertically

The nav behaves like a group of physical colored tokens rather than a standard tab bar.

The content carousel and navigation are synchronized. The active card becomes fully opaque while inactive cards remain visible at 55% opacity.

---

## 11. Iconography, illustration, and imagery

### 11.1 Icon style

The app uses:

- Simple outlined SVG icons
- Rounded stroke caps and joins
- Mostly 20–24px icons
- Dark navy strokes
- Occasional filled icons for emphasis

Icons generally avoid multicolor treatment unless they belong to AI or an animated category illustration.

### 11.2 Lottie

Lottie is a major part of the product's personality:

- Animated category navigation
- Animated avatars
- Poll illustrations
- Success and loading states
- Quick-action tiles
- Marketplace and event illustrations

Lottie assets are treated as content illustrations, not merely loading spinners.

### 11.3 Emoji

Emoji are used as lightweight illustrations when a custom asset is unnecessary. Typical sizes range from 20px to 32px, with larger marketplace placeholders around 44px.

### 11.4 Photography

Marketplace and news content use real photography with:

- 12–16px corner radius
- `object-fit: cover`
- White or gray fallback surfaces
- Dark scrims only where controls need contrast

---

## 12. Motion language

### 12.1 Timing ranges

| Motion | Typical duration |
|---|---:|
| Small state change | 150–250ms |
| Element entrance | 300–450ms |
| Sheet transition | 350–400ms |
| Full-page reveal | 400–450ms |
| Decorative loop | 1.4–3s |
| Slow ticker | 28s |

### 12.2 Common easing

Standard reveal:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Direct UI entrance:

```css
cubic-bezier(0, 0, 0.2, 1)
```

Sheet motion:

```css
cubic-bezier(0.65, 0, 0.35, 1)
```

Playful overshoot:

```css
cubic-bezier(0.34, 1.56, 0.64, 1)
```

### 12.3 Reveal pattern

The most common page entrance is:

- Start 8–18px lower
- Start at 0 opacity
- Rise to final position
- Fade to full opacity
- Stagger child sections by 40–170ms

### 12.4 Continuous animation

Continuous loops are reserved for:

- AI rainbow effects
- Pulsing urgent/live indicators
- Floating map pins
- Ticker content
- Skeleton loading

Do not animate every surface continuously. Static content should remain calm.

### 12.5 Reduced motion

Several primary components implement `prefers-reduced-motion`, especially:

- Header
- Hero
- Carousel
- Marketplace cards
- Events and marketplace pages
- Filter sheets
- Report flow

Coverage is not completely centralized, so a future implementation should create one shared reduced-motion strategy.

---

## 13. Interaction states

### Hover

Hover is subtle because the product is mobile-first:

- Small shadow increase
- Border emphasis
- No dramatic color inversion

### Pressed

Some controls scale down to approximately `0.92`. Most rely on native click feedback with tap highlight disabled.

### Focus

The header avatar and icon buttons define visible focus outlines, but focus treatment is not consistently centralized across all interactive controls.

Future implementations should preserve the visual language while applying one shared focus ring:

```css
outline: 2px solid #222233;
outline-offset: 2px;
```

### Disabled

- Opacity around 35%
- No pointer cursor
- Muted gray background where needed

### Selected

Common selected treatments:

- Dark navy fill with white text
- Pastel category fill with dark text
- 2px dark tab indicator
- Expanded active navigation circle

---

## 14. RTL and localization behavior

The product is Hebrew-first.

Observed conventions:

- Most major content roots explicitly use `dir="rtl"`.
- Text is generally right-aligned.
- Logical CSS properties such as `margin-inline`, `padding-inline`, and `inset-inline` are used in many components.
- Physical left/right positioning is still used where the visual behavior is intentionally directional, especially carousels and animated controls.
- Safe-area environment variables are included for mobile devices.

For a future app:

- Set `lang="he"` and `dir="rtl"` at the document level.
- Use logical properties by default.
- Use physical left/right only for intentionally physical animation or imagery.
- Verify icon direction for back arrows, chevrons, and carousel controls.

---

## 15. Accessibility characteristics

### Strengths

- Most important touch controls are at least 44×44px.
- Buttons frequently have Hebrew `aria-label` values.
- Dialog-like sheets use dialog roles and labels.
- Reduced-motion support exists across several core flows.
- Primary dark text on pastel backgrounds generally provides strong contrast.
- Controls use semantic buttons in most cases.

### Gaps to address when porting

- `index.html` currently declares `lang="en"` even though the product is Hebrew.
- RTL is set per component instead of globally.
- Focus-visible styling is inconsistent.
- Some low-opacity secondary text may need contrast verification at small sizes.
- Some motion effects do not share a universal reduced-motion fallback.
- Tap highlight is often disabled, so visible pressed/focus feedback must be deliberately preserved.

---

## 16. Current inconsistencies and implementation risks

These are important because they should not be copied into a new application.

### 16.1 Font path case mismatch

`src/index.css` references `../sources/Pangea_font/...`, while Git tracks the top-level directory as `Sources/`.

This may work on a case-insensitive macOS filesystem but fail on a case-sensitive Linux deployment.

### 16.2 Missing Hebrew bold font file

The CSS references `PangeaHebr-Bold.woff2`, but the tracked font list does not currently include that regular Hebrew bold file. It includes `PangeaHebr-BoldItalic.woff2`.

The browser may synthesize Hebrew bold or fall back unexpectedly.

### 16.3 Color tokens are incomplete

Only a few colors are defined globally. Category colors are repeated as raw hex values across files.

Before reusing the language, centralize:

- Five category colors
- Primary ink variants
- Semantic status colors
- AI gradient
- Surface and divider colors

### 16.4 Radius tokens do not exist

The radius system is visually consistent but implemented with repeated raw values.

Create named radius tokens before porting.

### 16.5 Similar colors vary

Primary dark values include:

- `#222233`
- `#121331`
- `#1A1A3E`
- `#1A1A1A`

These should be consolidated unless a real visual distinction is intended.

### 16.6 Typography token names are misleading

`thin` maps to weight 400 and `normal` maps to 500. A future implementation should rename them to `regular` and `medium`.

### 16.7 H3 and H4 are identical

Both are 16px / 22px. This is not necessarily wrong, but they are not visually distinct tokens.

### 16.8 Prototype frame is mixed with product styling

Desktop phone framing in `src/App.css` is useful for demos but should not be copied into production layout primitives.

---

## 17. Recommended portable token set

This is a normalized token layer derived from the current app. It represents the visual intent more clearly than the existing implementation.

```css
:root {
  /* Typography */
  --resident-font-family: "Pangea", sans-serif;
  --resident-weight-regular: 400;
  --resident-weight-medium: 500;
  --resident-weight-bold: 700;

  --resident-text-xs-size: 12px;
  --resident-text-xs-line: 17px;
  --resident-text-sm-size: 14px;
  --resident-text-sm-line: 20px;
  --resident-text-md-size: 16px;
  --resident-text-md-line: 22px;
  --resident-heading-sm-size: 16px;
  --resident-heading-sm-line: 22px;
  --resident-heading-md-size: 24px;
  --resident-heading-md-line: 34px;
  --resident-heading-lg-size: 32px;
  --resident-heading-lg-line: 45px;

  /* Foundation colors */
  --resident-color-ink: #222233;
  --resident-color-surface: #ffffff;
  --resident-color-canvas: #f5f5f5;
  --resident-color-fill-subtle: rgba(34, 34, 51, 0.04);
  --resident-color-divider: rgba(34, 34, 51, 0.10);
  --resident-color-text-secondary: rgba(34, 34, 51, 0.60);
  --resident-color-text-muted: rgba(34, 34, 51, 0.55);
  --resident-color-text-disabled: rgba(34, 34, 51, 0.35);

  /* Categories */
  --resident-color-news: #ceff7e;
  --resident-color-volunteer: #ffc9d9;
  --resident-color-polls: #d8c5ff;
  --resident-color-events: #c3ecf6;
  --resident-color-marketplace: #ffd4a8;

  /* Status */
  --resident-color-positive: #34c759;
  --resident-color-positive-text: #1f8f3e;
  --resident-color-attention: #ff6b4a;

  /* Spacing */
  --resident-space-1: 4px;
  --resident-space-2: 8px;
  --resident-space-3: 12px;
  --resident-space-4: 16px;
  --resident-space-5: 20px;
  --resident-space-6: 24px;
  --resident-space-8: 32px;
  --resident-space-10: 40px;
  --resident-space-12: 48px;

  /* Radius */
  --resident-radius-xs: 4px;
  --resident-radius-sm: 8px;
  --resident-radius-md: 12px;
  --resident-radius-lg: 16px;
  --resident-radius-xl: 20px;
  --resident-radius-sheet: 24px;
  --resident-radius-pill: 999px;

  /* Borders */
  --resident-border-default: 0.5px solid var(--resident-color-ink);
  --resident-border-subtle: 0.5px solid var(--resident-color-divider);

  /* Motion */
  --resident-duration-fast: 180ms;
  --resident-duration-standard: 350ms;
  --resident-duration-page: 420ms;
  --resident-ease-reveal: cubic-bezier(0.22, 1, 0.36, 1);
  --resident-ease-sheet: cubic-bezier(0.65, 0, 0.35, 1);
}
```

If the target application uses a design system, map these semantic roles to existing design-system tokens and components. Preserve the relationships and hierarchy; do not introduce parallel raw values unless the system has no equivalent.

---

## 18. Recipe for implementing this language in another app

### Step 1: Establish foundations

- Load Pangea Latin and Hebrew.
- Set the document to Hebrew RTL.
- Define the normalized color, spacing, typography, radius, and motion tokens.
- Set the default canvas to `#F5F5F5`.
- Set primary ink to `#222233`.

### Step 2: Build shared primitives

Create or configure:

- 44px icon button
- Primary CTA
- Secondary outlined CTA
- 12px-radius bordered card
- 20px-radius major card
- Pill chip
- 12–14px input
- Top bar
- Full-screen page shell
- Top sheet
- Bottom sheet

### Step 3: Apply category contexts

Give each major product domain one pastel canvas. Keep content surfaces white and text navy.

### Step 4: Add tactile metaphors selectively

Choose one signature component per domain:

- Ticket
- Note
- Tag
- Vote columns
- Map/match card

Do not make every card visually unique. The signature component should sit inside shared primitives.

### Step 5: Add motion last

Start with:

- 350–420ms page reveal
- 8–16px rise
- Staggered sections
- 350–400ms sheet motion

Only then add domain-specific loops or AI effects.

### Step 6: Validate

Check:

- Dark text contrast on every pastel
- 44px minimum touch targets
- RTL layout and icon direction
- Keyboard focus visibility
- Reduced-motion behavior
- Safe-area spacing
- Font loading on a case-sensitive deployment

---

## 19. Do and do not

### Do

- Use large pastel areas to communicate category.
- Use white nested surfaces for readability and action.
- Keep dark navy hairline outlines visible.
- Use 12px as the default component radius.
- Keep typography compact and weight-driven.
- Use 20px page gutters on mobile.
- Keep controls at least 44px tall or wide.
- Use Lottie and animation to communicate personality and state.
- Use logical RTL-aware CSS properties.
- Reserve rainbow treatment for AI.

### Do not

- Replace all borders with generic shadows.
- Use pure black as the default ink.
- Turn every surface into a large pill.
- Mix many unrelated accent colors inside one category.
- Use category pastels only as tiny badges.
- Copy the desktop phone frame into a production dashboard.
- Add constant motion to static content.
- Duplicate raw hex colors and radii across a new codebase.
- Assume the current font paths will work on Linux without correction.

---

## 20. Source reference map

Use these files when verifying or extending the specification:

| Area | Source |
|---|---|
| Global typography, spacing, colors, buttons | `src/index.css` |
| Mobile and desktop device layout | `src/App.css` |
| Screen composition and overlays | `src/App.tsx` |
| Header and 44px controls | `src/components/Header.css`, `src/components/IconButton.css` |
| Greeting hierarchy | `src/components/Hero.css` |
| Category palette and navigation behavior | `src/components/Carousel.tsx`, `src/components/Carousel.css` |
| News paper-note metaphor | `src/components/NewsCard.css` |
| Event ticket metaphor | `src/components/EventsCard.css` |
| Marketplace ticket and price tag | `src/components/MarketplaceCard.css` |
| Poll visualization | `src/components/PollsCard.css` |
| Volunteer map and match state | `src/components/VolunteerCard.css` |
| Top sheets | `src/components/QuickActions.css`, `src/components/AddMenu.css` |
| Bottom sheet | `src/components/MarketplaceFilterSheet.css` |
| AI color and motion | `src/components/AISearch.css`, `src/components/AIBot.css` |
| Full-screen category page | `src/components/EventsPage.css`, `src/components/MarketplacePage.css` |
| Profile layout | `src/components/Profile.css`, `src/components/PublicProfile.css` |
| News detail layout | `src/components/NewsDetailPage.css` |
| Creation/report flow | `src/components/ReportNewsPage.css` |
| Loading and branded entrance | `src/components/LoadingScreen.css` |

---

## Final implementation summary

The residents app should be reproduced as a **border-led, pastel-coded, mobile-first community interface**.

The non-negotiable characteristics are:

1. Pangea typography with compact Hebrew-friendly sizing.
2. Dark navy ink instead of black.
3. Five pale category canvases.
4. White nested cards and controls.
5. 0.5px navy outlines.
6. 12px default radius, 20–24px major radius, pill chips.
7. A 4px spacing scale with 20px mobile gutters.
8. 44px minimum interactive controls.
9. Tactile category metaphors.
10. Staggered, purposeful motion with AI-specific rainbow effects.

If those relationships are preserved, the language can scale to a dashboard or another product without copying the residents app screen-for-screen.
