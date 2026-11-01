# Earth Voyage — Travel Packing & Readiness Planner

Earth Voyage is an editorial, golden-era aviation-inspired travel packing application that transforms trip preparation into a calm, structured readiness workflow. Travelers enter their destination and trip duration to generate a smart, categorized packing manifest with real-time progress tracking, custom item management, and automatic browser persistence.

## User Review & Critical Decisions

> [!IMPORTANT]
> Because the initial preference questions were skipped, the plan adopts the recommended defaults below so the application stays effortless on quick trips while remaining rich enough for multi-week expeditions. Let us know if you would like any of these adjusted before building.

- **Trip Setup Scope (Default Selected)**: Required **Destination** and **Days** inputs with inline validation, paired with optional **Climate Profile** (Temperate, Tropical, Cold/Alpine, Business) and **Departure Date** fields to tailor categories and enrich the Voyage Summary Card.
- **Smart Quantity Scaling (Default Selected)**: Essential apparel and toiletries automatically scale their recommended quantities based on the entered number of days and selected climate profile.
- **Custom Item Creation (Default Selected)**: Travelers can add custom items specifying **Item Name**, **Category**, and **Quantity** (both from a global quick-add bar and directly within any category card).
- **Dashboard Filtering & Reset Controls (Default Selected)**: Interactive filter tabs (All Items, Unpacked, Packed, and category filters) plus an in-app **Reset / New Trip** confirmation dialog offering either *Uncheck All Items* (re-use list) or *Start New Trip* (clear and return to trip setup).

---

## 1. Overview & Core Concept

- **What It Does**: Guides travelers from initial trip creation (Destination & Days validation) into an interactive expedition packing dashboard featuring a live master readiness meter, categorized packing cards, instant checkbox state updates, custom item creation/deletion, and trip reset controls—all saved seamlessly across browser reloads.
- **Target Audience / Persona**: Leisure and business travelers preparing on desktop before departure and checking off final cabin essentials one-handed on mobile devices while packing.
- **Key Value**: Eliminates forgotten essentials and checklist clutter through duration-aware item quantities, unmistakable visual readiness milestones, and zero-friction local persistence without requiring an account.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Onboarding & Voyage Creation (Zero-State)**:
   - On first visit (or after starting a new trip), the traveler sees the **Earth Voyage Departure Manifest** form.
   - Submitting validates that **Destination** is non-empty (at least 2 characters) and **Days** is a valid whole number between `1` and `365`, displaying crisp inline field error messages if invalid.
   - Upon valid submission, a tailored multi-category packing list is generated and persisted immediately.
2. **Real-Time Packing & Progress Tracking**:
   - At the top of the active dashboard, the **Voyage Summary Card** displays the destination, duration, departure metadata, a circular **Master Readiness Ring**, and the continuous **Packing Capacity Progress Bar** that smoothly fills from Electric Indigo to Emerald Teal as items are checked.
   - Toggling any custom `22px × 22px` checkbox immediately updates the item's visual state (dimming to `65%` opacity with a delicate strike-through), recalculates its **Category Progress Badge** (e.g., `4/6` shifting to Emerald Teal with a check icon at `6/6`), and updates the top master progress bar.
3. **Adding & Deleting Items**:
   - Travelers use the **Add Custom Item** form (with validation for item name, category selection, and quantity stepper) to append personal gear to any existing or custom category.
   - Clicking the remove button on any item deletes it immediately and dynamically recalculates category and overall completion percentages.
4. **Filtering & Reset / New Trip**:
   - Interactive segmented controls filter items by status (*All*, *Remaining*, *Packed*) or search query without losing underlying state.
   - Clicking **Reset / New Trip** opens an accessible in-app confirmation modal (avoiding browser native alerts) where users can either **Uncheck All Items** to repack for the same itinerary or **Start New Trip** to clear stored voyage data and return to the setup screen.

### Visual Identity & Theme
- **Aesthetic Direction**: *Modern Retro-Travel Fusion*—combining golden-era aviation clarity (clean boarding-pass hierarchy, luggage-inspired rounded geometry) with crisp contemporary utility.
- **Color Palette & Mood**:
  - **Neutral Canvas**: Soft Indigo Mist (`#F8F7FC`) across the viewport background to minimize glare.
  - **Elevated Surfaces**: Pure White (`#FFFFFF`) cards and checklist rows framed by `1px` hairline structural borders (`#EAE6F8`) and soft indigo-tinted ambient shadows (`0 4px 20px -2px rgba(60, 47, 128, 0.04)`).
  - **Primary Accent**: Electric Indigo (`#5D3BE0`) for primary CTAs, active checkboxes, focus rings, and progress bar start.
  - **Secondary Accent**: Hyacinth Blue (`#9E5AFD`) for button hover transitions, category accents, and interactive highlights.
  - **Completion Milestone**: Emerald Teal (`#10B981`) reserved strictly for `100%` packed category chips, completed readiness states, and the progress meter completion gradient.
  - **Typography Colors**: Twilight Blue (`#3C2F80`) for primary headings and item labels; Muted Slate (`#6B619B`) for quantities, auxiliary notes, and struck-through packed items; Crimson (`#BA1A1A`) for validation errors and delete hover states.
- **Typography & Hierarchy**:
  - **Roboto Flex** across display headings (`40px`/`32px` desktop, `30px`/`24px` mobile, weight `700`), category headers (`22px`/`18px`, weight `600`), primary checklist rows (`16px`, weight `400`), and precision status labels (`12px`, weight `600`), with `tabular-nums` enforced on all counters, quantities, and percentages to prevent layout shift.
- **Component Styling & Responsive Layout**:
  - **Desktop (`> 1024px`)**: `1200px` centered container (`2rem` margins, `1.25rem` gutters) featuring a full-width Voyage Summary & Progress Hero above a balanced 2-column masonry-style grid of Category Cards.
  - **Tablet (`768px – 1024px`)**: Dual-column grid with `1.5rem` margins and `1rem` gutters.
  - **Mobile (`< 768px`)**: Single-column thumb-friendly stream (`1rem` margins, `0.75rem` gutters) with `48px` minimum height primary buttons and `44px` minimum tap targets on checkboxes and delete triggers.

### Interactive Feedback & Motion
- **Snappy Micro-Interactions (`≤ 200ms`)**: Smooth `transform` and `opacity` transitions when toggling checkboxes, adding custom items, hovering buttons (`#5D3BE0` → `#9E5AFD`), and completing a category.
- **100% Readiness Milestone**: When the final unpacked item is checked off, the Voyage Summary Card transitions into an Emerald Teal "Ready for Departure" banner state.

---

## 3. Key Product Decisions & Trade-Offs

- **Rule-Based Smart Manifest Generation vs. Blank Slate**
  - *Chosen Approach*: Generate a curated, duration-scaled packing list across core travel categories (*Travel Documents*, *Apparel & Layers*, *Toiletries & Health*, *Tech & Cabin Gear*, plus climate-specific gear) as soon as the user submits Destination & Days.
  - *Why*: Gives immediate utility and demonstrates real-time progress bar mechanics right away while allowing full customization via Add Custom Item and Delete controls.
  - *Alternatives Considered*: Starting with zero items (forces tedious manual data entry before checkboxes or progress tracking can be used).
- **Client-Side `localStorage` Persistence with Schema Safeguards**
  - *Chosen Approach*: Synchronize the complete voyage state (destination, days, climate, items, check states) to versioned `localStorage` on every state transition, wrapped in safe JSON parsing/fallback guards.
  - *Why*: Directly fulfills the requirement for instant offline-capable persistence across page refreshes with zero network latency or login friction.
- **In-App Reset Confirmation Dialog vs. Native Browser Confirm**
  - *Chosen Approach*: Render a custom accessible confirmation modal styled in the Earth Voyage palette with two clear actions (*Uncheck All Items* vs. *Start New Trip*).
  - *Why*: Native `window.confirm` / `window.alert` dialogs are blocked or jarring inside embedded iframe environments and break visual cohesion.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    Browser LocalStorage ("earth_voyage_v1")             │
│         Persists Trip Metadata, Categories, Custom Items & Checks       │
└───────────────────────────────────▲─────────────────────────────────────┘
                                    │ Hydrate on Mount / Sync on Change
┌───────────────────────────────────▼─────────────────────────────────────┐
│                      Application State Controller                       │
│   • Active Trip (destination, days, climate, departureDate, createdAt)  │
│   • Packing Items[] (id, name, category, quantity, packed, isCustom)    │
│   • UI Filter State (statusFilter, activeCategory, searchQuery, modal)  │
└───────────────┬─────────────────────────────────────────┬───────────────┘
                │ No Active Trip                          │ Active Trip Exists
                ▼                                         ▼
┌───────────────────────────────┐       ┌─────────────────────────────────┐
│    Voyage Setup View (Form)   │       │     Expedition Dashboard View   │
│ • Destination Input (Valid.)  │       │                                 │
│ • Duration / Days (1–365)     │       │ ┌─────────────────────────────┐ │
│ • Climate & Optional Date     │       │ │  Top Navigation & Actions   │ │
│ • Smart Manifest Generator    │       │ │ • Brand Mark                │ │
└───────────────────────────────┘       │ │ • Reset / New Trip Trigger  │ │
                                        │ └──────────────┬──────────────┘ │
                                        │                ▼                │
                                        │ ┌─────────────────────────────┐ │
                                        │ │ Voyage Summary & Readiness  │ │
                                        │ │ • Destination & Days Header │ │
                                        │ │ • SVG Readiness Ring (%)    │ │
                                        │ │ • Indigo→Teal Progress Bar  │ │
                                        │ └──────────────┬──────────────┘ │
                                        │                ▼                │
                                        │ ┌─────────────────────────────┐ │
                                        │ │ Add Custom Item & Filters   │ │
                                        │ │ • Validated Custom Item Bar │ │
                                        │ │ • All / Unpacked / Search   │ │
                                        │ └──────────────┬──────────────┘ │
                                        │                ▼                │
                                        │ ┌─────────────────────────────┐ │
                                        │ │ Responsive Category Grid    │ │
                                        │ │ • Category Progress Chip    │ │
                                        │ │ • 22x22 Custom Checkboxes   │ │
                                        │ │ • Item Row Strike & Delete  │ │
                                        │ └──────────────┬──────────────┘ │
                                        │                ▼                │
                                        │ ┌─────────────────────────────┐ │
                                        │ │ Reset / New Trip Modal      │ │
                                        │ │ • Uncheck All vs. New Trip  │ │
                                        │ └─────────────────────────────┘ │
                                        └─────────────────────────────────┘
```

### Data Model & State
- **Trip Configuration**: Stores `destination` (trimmed string), `days` (integer `1..365`), `climate` (`temperate` | `tropical` | `cold` | `business`), and optional `departureDate`.
- **Packing Item**: Stores unique `id`, `name`, `category` (`Documents & Money`, `Clothing & Footwear`, `Toiletries & Wellness`, `Electronics & Cabin`, `Destination Essentials`, or `Custom`), `quantity` (number), `packed` (boolean), and `isCustom` (boolean).
- **Derived Progress Metrics**: Computed purely from the `items` array in real time—`totalCount`, `packedCount`, `percentage` (`0–100%`), and per-category `{ packed, total, isComplete }` summaries—guaranteeing the progress bar and category chips can never drift out of sync with individual checkboxes.

### Interactive Component & State Mapping
- **Trip Setup Form Submit**: Validates `destination.trim().length >= 2` and `Number.isInteger(days) && days >= 1 && days <= 365`; sets field-specific error messages on failure or generates scaled starter items and transitions to the Dashboard View on success.
- **Checkbox Toggle (`onToggleItem`)**: Flips `item.packed` by `id`, immediately re-rendering row opacity/strike-through, category completion chip, SVG readiness ring, and top gradient capacity bar while writing to `localStorage`.
- **Add Custom Item (`onAddItem`)**: Validates non-empty item title and positive quantity, prepends/appends the new item into the selected category, clears the input field, and resets filters if hidden so the user immediately sees their added item.
- **Delete Item (`onDeleteItem`)**: Removes the item by `id` from state and `localStorage`, smoothly updating total and category denominators (handling `0/0` empty states cleanly with an empty-list prompt).
- **Reset / New Trip (`onUncheckAll` / `onResetTrip`)**: Opens confirmation modal; *Uncheck All* sets `packed: false` across all items, while *Start New Trip* clears the stored voyage key in `localStorage` and returns cleanly to the Voyage Setup View.
