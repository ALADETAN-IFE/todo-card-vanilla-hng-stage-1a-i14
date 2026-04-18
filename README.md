# Frontend Wizards Todo Card - Stage 1a (Vanilla HTML/CSS/JS)

This folder contains the Stage 1a single Todo Card implementation in plain HTML, CSS, and JavaScript.

## Files

- `index.html`: Semantic card structure, test IDs, and accessibility attributes.
- `style.css`: Visual design system, responsive layout, and state-driven styles.
- `script.js`: Stateful behavior, inline editing logic, status synchronization, and time updates.
- `task.md`: Official Stage 1a requirements.

## What Changed From Stage 0

- Added inline edit mode on existing card fields (title, description, priority, due date).
- Added `Save` and `Cancel` actions that replace `Edit` and `Delete` during edit mode.
- Added editable status control with allowed values: `Pending`, `In Progress`, `Done`.
- Added priority indicator wrapper and priority-based visual styles.
- Added collapsible description behavior with an accessible expand/collapse button.
- Added overdue indicator and overdue card accent.
- Updated time logic to refresh every 30 seconds with granular labels.
- Added `Completed` behavior when status is `Done` (timer stops updating).
- Added real delete behavior with confirmation and card removal.

## New Design Decisions

- Inline editing was chosen instead of a separate edit panel to reduce context switching.
- The action bar uses state-based swapping:
  `Edit/Delete` in normal mode and `Save/Cancel` in edit mode.
- Priority and status use data attributes on the card for clean, predictable style targeting.
- Description truncation uses line clamp in collapsed mode to end with `...`.
- Time updates are centralized so UI labels and overdue styles stay synchronized.

## Behavior Summary

- Checkbox checked -> status becomes `Done`.
- Status changed to `Done` -> checkbox becomes checked.
- Checkbox unchecked after `Done` -> status returns to `Pending`.
- Save applies inline edits to the card.
- Cancel restores the pre-edit snapshot.
- Expand button only appears when description length exceeds threshold.
- Overdue state shows both red accent and explicit `Overdue` badge.

## Accessibility Notes

- Edit controls include associated labels (including visually hidden labels where needed).
- Status control has an accessible name.
- Expand toggle uses `aria-expanded` and `aria-controls`.
- Collapsible section has a matching `id` target.
- Time remaining uses `aria-live="polite"` for non-disruptive updates.
- Focus returns to the `Edit` button after closing edit mode.
- Keyboard flow order is explicitly managed:
  checkbox -> status control -> expand toggle -> edit -> delete -> save/cancel.

## Known Limitations

- Data is in-memory only and resets on page refresh.
- Delete removes the card from the DOM and does not support undo.
- Focus trapping inside edit mode is not implemented (optional requirement).
- The task is single-card only and does not include persistence or multi-card management.

## Run Locally

Open `index.html` directly, or run a static server from this folder:

```bash
npx serve .
```

## Test IDs

All Stage 0 test IDs remain available, and Stage 1a test IDs were added for:

- edit form container and edit inputs
- save and cancel buttons
- status control
- priority indicator
- expand toggle and collapsible section
- overdue indicator

## Live Demo

- Vercel deployment: [Vercel](https://todo-card-vanilla.vercel.app)

## Author

- Name: Fortune Ife Aladetan
- Email: [contact@ifecodes.xyz](mailto:fortuneifealadetan01@gmail.com)
- GitHub: [ALADETAN-IFE](https://github.com/ALADETAN-IFE)
- Portfolio: [ifecodes.xyz](https://www.ifecodes.xyz)
