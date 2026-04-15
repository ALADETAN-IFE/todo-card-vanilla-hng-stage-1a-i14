# Frontend Wizards - Stage 1a Task

## Advanced Todo Card (Interactive and Stateful)

## Overview

In Stage 1, you will extend your Stage 0 Todo Card into a more interactive, stateful, and slightly more app-like component. You are still building a single Todo Card, not a full app.

The card should now support:

- Editable content
- Status transitions
- Priority changes
- Expand/collapse behavior
- More dynamic time handling
- Slightly richer accessibility patterns

## Enhancements

Add the following functionality.

### Editing Mode

When the edit button is clicked, the card should enter edit mode.

- Edit form container: `data-testid="test-todo-edit-form"`
- Title input: `data-testid="test-todo-edit-title-input"`
- Description textarea: `data-testid="test-todo-edit-description-input"`
- Priority select dropdown: `data-testid="test-todo-edit-priority-select"`
- Due date input: `data-testid="test-todo-edit-due-date-input"`
- Save button: `data-testid="test-todo-save-button"`
- Cancel button: `data-testid="test-todo-cancel-button"`

### Status Controls

Instead of just displaying status, allow the user to toggle it.

Add:

- Status dropdown or segmented control: `data-testid="test-todo-status-control"`

Allowed statuses:

- `Pending`
- `In Progress`
- `Done`

### Priority Indicator Enhancements

Add:

- Priority indicator: `data-testid="test-todo-priority-indicator"`

This could be:

- A colored dot
- An icon
- A left border accent
- A background color change

It must visually change depending on:

- `Low`
- `Medium`
- `High`

### Expand/Collapse Behavior

The description should be collapsible if it's too long.

Add:

- Expand/collapse toggle button: `data-testid="test-todo-expand-toggle"`
- Collapsible container: `data-testid="test-todo-collapsible-section"`

Behavior:

- Default collapsed if description exceeds a certain length
- Clicking expand reveals full content
- Toggle must be keyboard accessible

### Time Management Enhancements

Add:

- Overdue indicator: `data-testid="test-todo-overdue-indicator"`

If overdue:

- Show a visible visual change (e.g., red text or badge)
- Show explicit `Overdue` indicator

Time logic should now:

- Update every 30-60 seconds
- Show granular time:
  - `Due in 2 days`
  - `Due in 3 hours`
  - `Due in 45 minutes`
  - `Overdue by 1 hour`

If status becomes `Done`:

- Time remaining should stop updating
- Replace with: `Completed`

## Behavioral Requirements

### 1. Edit Mode

- Clicking Edit switches into edit form
- Save updates the card values
- Cancel restores previous values

Edit mode must:

- Trap focus inside form (optional bonus)
- Return focus to Edit button when closed

### 2. Status Logic Rules

- If checkbox toggled -> status becomes `Done`
- If status manually set to `Done` -> checkbox becomes checked
- If unchecked after `Done` -> revert to `Pending`
- Status must stay visually synced with:
  - Checkbox
  - Status display
  - Status control

### 3. Visual State Changes

- `Done` -> strike-through title + muted colors
- `High priority` -> strong visual indicator
- `Overdue` -> red accent
- `In Progress` -> distinct visual style

## Accessibility Requirements

- Edit form fields must have `<label for="">`
- Status dropdown must have accessible name
- Expand toggle must use: `aria-expanded`, `aria-controls`
- Collapsible section must have matching `id`
- Live time updates should use `aria-live="polite"`

Keyboard flow must remain:

`Tab -> Checkbox -> Status control -> Expand toggle -> Edit -> Delete -> Save/Cancel (in edit mode)`

## Responsiveness

Layout adapts to:

- 320px mobile
- 768px tablet
- 1024px+

Edit form fields stack vertically on mobile.

On desktop:

- Priority and status may align horizontally

No layout breaking when:

- Title is long
- Tags wrap to multiple lines
- Description is extremely long

## Acceptance Criteria

- All Stage 0 testids still exist
- All new testids exist and work
- Edit mode fully functional
- Status transitions synchronized
- Expand/collapse accessible
- Overdue logic correct
- No visual overflow at any size
- Keyboard fully usable
- Time updates properly
- Clean state management

## Submission

Submit:

- Updated live URL
- Updated GitHub repo
- Updated README including:
  - What changed from Stage 0
  - New design decisions
  - Any known limitations
  - Accessibility notes
- Airtable link

- Submission link: https://docs.google.com/forms/d/e/1FAIpQLSfyENWbGf9qRkmDj77BIEAPkO0WwIqDpeR6_dte026HA-KuWQ/viewform
- Deadline: 17/04/2026 11:59pm
