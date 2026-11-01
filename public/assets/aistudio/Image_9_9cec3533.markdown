---
name: Earth Voyage
colors:
  surface: '#faf9fe'
  surface-dim: '#dad9de'
  surface-bright: '#faf9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf2'
  surface-container-high: '#e8e7ec'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1c1f'
  on-surface-variant: '#484555'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#797587'
  outline-variant: '#c9c4d8'
  surface-tint: '#5f3de2'
  primary: '#4514c9'
  on-primary: '#ffffff'
  primary-container: '#5d3be0'
  on-primary-container: '#d9d0ff'
  inverse-primary: '#c9beff'
  secondary: '#782dd5'
  on-secondary: '#ffffff'
  secondary-container: '#924df0'
  on-secondary-container: '#fffbff'
  tertiary: '#004f35'
  on-tertiary: '#ffffff'
  tertiary-container: '#006a48'
  on-tertiary-container: '#60eeb1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#c9beff'
  on-primary-fixed: '#1b0063'
  on-primary-fixed-variant: '#4618ca'
  secondary-fixed: '#eddcff'
  secondary-fixed-dim: '#d7baff'
  on-secondary-fixed: '#280056'
  on-secondary-fixed-variant: '#6100be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf9fe'
  on-background: '#1a1c1f'
  surface-variant: '#e3e2e7'
typography:
  headline-xl:
    fontFamily: Roboto Flex
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-xl-mobile:
    fontFamily: Roboto Flex
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg:
    fontFamily: Roboto Flex
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Roboto Flex
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Roboto Flex
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Roboto Flex
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system synthesizes mid-century golden-era aviation romance with crisp, contemporary product utility. The emotional tone evokes wanderlust, serene preparedness, and purposeful movement. It sheds cluttered, utilitarian checklist tropes in favor of an airy, editorial travel journal aesthetic. 

The aesthetic is characterized by:
- **Modern Retro-Travel Fusion:** Refined editorial typography paired with dynamic electric violets, balanced against warm, mist-toned backdrops.
- **Atmospheric Clarity:** Spacious canvas layouts, generous breathing room around packing categories, and deliberate line-weight iconography that nods to classic boarding passes, baggage tags, and destination stamps without falling into kitsch.
- **Tactile Softness:** Subtly framed cards, deep pill controls, and quiet chromatic depth that feels effortless on handheld touch devices.

## Colors

The palette balances intense violet-indigo anchors with soft, low-fatigue atmospheric tints.

- **Primary (`#5D3BE0` - Electric Indigo):** Drives decisive actions, primary check triggers, key interactive controls, and active progress indicators.
- **Secondary (`#9E5AFD` - Hyacinth Blue):** Supports category highlights, ambient state overlays, active tab highlights, and secondary interactive states.
- **Tertiary (`#10B981` - Emerald Teal):** Reserved exclusively for packing completion badges, 100% packed milestones, ready states, and positive confirmations.
- **Neutral Canvas (`#F8F7FC` - Soft Indigo Mist):** The foundation background across screen layouts, reducing glare compared to stark white.
- **Surface Elevation (`#FFFFFF`):** High-clarity foreground panels and checklist container rows, bound by fine-drawn structural borders (`#EAE6F8`).
- **Hierarchy & Text:**
  - **Headers & Emphasized Text:** Twilight Blue (`#3C2F80`) provides deep, non-harsh contrast.
  - **Body & Secondary Metadata:** Muted Slate Tint (`#6B619B`) ensures legibility for auxiliary item details (e.g., weights, quantities, notes) without competing with item names.

## Typography

Typography relies on the modern, highly calibrated mechanical clarity of **Roboto Flex**. 

- **Titles & Destinations:** Emphasize deliberate hierarchy using heavier weights (`700`), spaced tightly to anchor categorical destination blocks and checklist headers.
- **List Items & Editorial Data:** Scaled at `16px` (`body-lg`) for primary item names to guarantee swift readability on moving transit screens.
- **Labels & Tags:** Rendered in `label-md` and `label-sm` with slight uppercase tracking where applied to status badges, luggage dimensions, and weather tags to maintain retro travel badge precision.

## Layout & Spacing

The layout model emphasizes a fluid responsive grid engineered for single-column handheld packing tasks that gracefully scales to multi-column expedition dashboards on wider screens.

- **Breakpoints & Columns:**
  - **Mobile (< 768px):** 4-column fluid layout with `1rem` outer margins (`margin-mobile`) and `0.75rem` column gutters. All checklists stack in single-card column streams to support natural thumb reaches.
  - **Tablet (768px - 1024px):** 8-column layout with `1.5rem` margins and `1rem` gutters; categories split into dual-column cards.
  - **Desktop (> 1024px):** 12-column layout with maximum content width capped at `1200px`, using `2rem` margins and `1.25rem` gutters.
- **Vertical Rhythm:** Maintained through consistent `space-md` gaps between checklist entries and `space-xl` separation between trip categories (e.g., "Documents", "Cabin Essentials", "Cold Weather Gear").

## Elevation & Depth

Visual hierarchy uses a crisp hybrid of tinted ambient depth and thin structural outlines:

- **Low-Contrast Structural Outlines:** Surfaces are bounded by a hairline `1px` border in `#EAE6F8`. This delivers a defined card silhouette without heavy visual weight.
- **Subtle Chromatic Shadows:** Rather than cold carbon-black shadows, elevations employ soft indigo-tinted dispersion:
  - **Base Layer (Checklist Cards):** `0 4px 20px -2px rgba(60, 47, 128, 0.04)`
  - **Floating Action / Active State (Drag, Active Category):** `0 12px 32px -4px rgba(93, 59, 224, 0.12)`
  - **Modals / Sticky Navigation:** `0 20px 40px -8px rgba(60, 47, 128, 0.16)`
- **Atmospheric Layering:** Layered surfaces remain pure white (`#FFFFFF`) sitting gently on the `#F8F7FC` canvas, allowing check statuses to stand out immediately.

## Shapes

The interface embraces a modern, generously rounded shape language:

- **Standard Elements (Buttons, Inputs, Row Elements):** Styled at `rounded-md` (`0.5rem`) to maintain tactile clarity.
- **Luggage Containers & Category Cards:** Emphasize soft curvature through `rounded-2xl` (`1rem` to `1.5rem`), echoing smooth vintage hard-shell luggage and aerodynamic travel hulls.
- **Status Pills, Toggles & Badges:** Utilize full pill shapes (`9999px` radius) for an approachable, tactile handheld feel.

## Components

### Buttons
- **Primary:** Background in Electric Indigo (`#5D3BE0`), white text, `rounded-lg` (`1rem`), minimum height 48px on mobile for thumb accessibility. Subtle hover state transitions to Hyacinth Blue (`#9E5AFD`).
- **Secondary / Ghost:** Outlined in `#EAE6F8` with Twilight Blue (`#3C2F80`) text and transparent background. On hover, background shifts to a 6% tint of `#5D3BE0`.
- **Destructive / Remove:** Borderless, Muted Slate (`#6B619B`) turning to Crimson on hover.

### Checklist Items & Checkboxes
- **Checklist Item Row:** Pure white background, `1px` solid border (`#EAE6F8`), `rounded-lg`, with internal padding of `space-md`. Completed items dim to `opacity: 0.65`, item text displays a delicate strike-through in `#6B619B`.
- **Checkboxes:** Custom `22px × 22px` square elements with `rounded-md` (6px radius). 
  - Unchecked: `2px` solid border in `#6B619B/40`.
  - Checked: Solid background fill in Electric Indigo (`#5D3BE0`) or Emerald Teal (`#10B981`) with a crisp white centered check mark.

### Category Progress Chips
- Pill-shaped badges (`rounded-full`) showing total items packed (e.g., `4/6`). 
- When partially complete, background is a pale violet tint with `#5D3BE0` text.
- When 100% complete, background shifts to soft teal tint with `#10B981` text and an emerald mini-check icon.

### Form Inputs
- Single-line inputs for custom travel items have a `#FFFFFF` fill, `#EAE6F8` border, and text set in Twilight Blue (`#3C2F80`).
- Focus state activates an Electric Indigo outline (`2px`) with a soft `4px` glow in `rgba(93, 59, 224, 0.15)`.

### Cards & Voyage Widgets
- **Voyage Summary Card:** Displays destination, departure date, and master readiness ring. Bound in `rounded-2xl` with a `#FFFFFF` body and delicate chromatic drop shadow.
- **Luggage Weight / Capacity Meter:** A continuous bar with a `rounded-full` track in `#EAE6F8` filled by an Electric Indigo to Emerald Teal gradient representing total packing progress.