const root = document.body;

function formatDueDate(date) {
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return `Due ${datePart} at ${timePart}`;
}

function formatTimeRemaining(now, dueDate) {
  const difference = dueDate.getTime() - now;
  const absoluteDifference = Math.abs(difference);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (absoluteDifference === 0) {
    return { label: "Due now!", overdue: false };
  }

  const pluralize = (value, unit) =>
    `${value} ${unit}${value === 1 ? "" : "s"}`;

  const toWholeMinutes = (ms) => Math.max(1, Math.floor(ms / minute));
  const toWholeSeconds = (ms) => Math.max(1, Math.floor(ms / 1000));

  const formatHoursAndMinutes = (ms) => {
    const totalMinutes = toWholeMinutes(ms);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return pluralize(minutes, "minute");
    if (minutes === 0) return pluralize(hours, "hour");

    return `${pluralize(hours, "hour")} and ${pluralize(minutes, "minute")}`;
  };

  if (difference > 0) {
    if (absoluteDifference <= minute) {
      return {
        label: `Due in ${pluralize(toWholeSeconds(absoluteDifference), "second")}`,
        overdue: false,
      };
    }

    if (absoluteDifference < hour) {
      return {
        label: `Due in ${pluralize(toWholeMinutes(absoluteDifference), "minute")}`,
        overdue: false,
      };
    }

    if (absoluteDifference < day) {
      return {
        label: `Due in ${formatHoursAndMinutes(absoluteDifference)}`,
        overdue: false,
      };
    }

    return {
      label: `Due in ${pluralize(Math.max(1, Math.floor(absoluteDifference / day)), "day")}`,
      overdue: false,
    };
  }

  if (absoluteDifference <= minute) {
    return {
      label: `Overdue by ${pluralize(toWholeSeconds(absoluteDifference), "second")}`,
      overdue: true,
    };
  }

  if (absoluteDifference < hour) {
    return {
      label: `Overdue by ${pluralize(toWholeMinutes(absoluteDifference), "minute")}`,
      overdue: true,
    };
  }

  if (absoluteDifference < day) {
    return {
      label: `Overdue by ${formatHoursAndMinutes(absoluteDifference)}`,
      overdue: true,
    };
  }

  return {
    label: `Overdue by ${pluralize(Math.max(1, Math.floor(absoluteDifference / day)), "day")}`,
    overdue: true,
  };
}

function toDateTimeLocalString(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const card = root.querySelector('[data-testid="test-todo-card"]');
const title = root.querySelector('[data-testid="test-todo-title"]');
const description = root.querySelector('[data-testid="test-todo-description"]');
const statusText = root.querySelector('[data-testid="test-todo-status"]');
const statusControl = root.querySelector(
  '[data-testid="test-todo-status-control"]',
);
const priorityBadge = root.querySelector('[data-testid="test-todo-priority"]');
const dueDateElement = root.querySelector('[data-testid="test-todo-due-date"]');
const timeRemaining = root.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);
const overdueIndicator = root.querySelector(
  '[data-testid="test-todo-overdue-indicator"]',
);
const checkbox = root.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const toggleCopy = root.querySelector("[data-todo-toggle-copy]");
const expandToggle = root.querySelector(
  '[data-testid="test-todo-expand-toggle"]',
);
const collapsibleSection = root.querySelector(
  '[data-testid="test-todo-collapsible-section"]',
);

const editButton = root.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton = root.querySelector(
  '[data-testid="test-todo-delete-button"]',
);
const editForm = root.querySelector('[data-testid="test-todo-edit-form"]');
const editTitleInput = root.querySelector(
  '[data-testid="test-todo-edit-title-input"]',
);
const editDescriptionInput = root.querySelector(
  '[data-testid="test-todo-edit-description-input"]',
);
const editPrioritySelect = root.querySelector(
  '[data-testid="test-todo-edit-priority-select"]',
);
const editDueDateInput = root.querySelector(
  '[data-testid="test-todo-edit-due-date-input"]',
);
const saveButton = root.querySelector('[data-testid="test-todo-save-button"]');
const cancelButton = root.querySelector(
  '[data-testid="test-todo-cancel-button"]',
);

if (
  !card ||
  !title ||
  !description ||
  !statusText ||
  !statusControl ||
  !priorityBadge ||
  !dueDateElement ||
  !timeRemaining ||
  !overdueIndicator ||
  !checkbox ||
  !toggleCopy ||
  !expandToggle ||
  !collapsibleSection ||
  !editButton ||
  !deleteButton ||
  !editForm ||
  !editTitleInput ||
  !editDescriptionInput ||
  !editPrioritySelect ||
  !editDueDateInput ||
  !saveButton ||
  !cancelButton
) {
  throw new Error("Required todo card elements were not found");
}

const DESCRIPTION_COLLAPSE_THRESHOLD = 115;
const TIMER_INTERVAL_MS = 30000;

const state = {
  title: "Add Inline Editing Experience to the Todo Task Card",
  description:
    "Implement inline editing, synchronized status transitions, collapsible content, and accurate time tracking with accessible keyboard-first interactions.",
  priority: "High",
  status: "Pending",
  dueDate: new Date("2026-04-17T23:59:00"),
  isExpanded: false,
  isEditing: false,
};

let editSnapshot = null;
let timerId = null;

function shouldCollapseDescription(text) {
  return text.trim().length > DESCRIPTION_COLLAPSE_THRESHOLD;
}

function syncCompletionText() {
  toggleCopy.textContent = checkbox.checked
    ? "This task is marked complete."
    : "This task is not complete.";
}

function syncStatusRuleFromCheckbox(isChecked) {
  if (isChecked) {
    state.status = "Done";
    return;
  }

  if (state.status === "Done") {
    state.status = "Pending";
  }
}

function syncCheckboxFromStatus(statusValue) {
  checkbox.checked = statusValue === "Done";
}

function updateTimerLifecycle() {
  if (state.status === "Done") {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
    return;
  }

  if (timerId === null) {
    timerId = window.setInterval(() => {
      renderTimeSection();
    }, TIMER_INTERVAL_MS);
  }
}

function renderExpandState() {
  if (state.isEditing) {
    expandToggle.classList.add("hidden");
    collapsibleSection.classList.remove("is-collapsed");
    expandToggle.setAttribute("aria-expanded", "true");
    expandToggle.textContent = "Collapse details";
    return;
  }

  const canCollapse = shouldCollapseDescription(state.description);
  expandToggle.classList.toggle("hidden", !canCollapse);

  const collapsed = canCollapse && !state.isExpanded;
  collapsibleSection.classList.toggle("is-collapsed", collapsed);

  expandToggle.setAttribute("aria-expanded", String(!collapsed));
  expandToggle.textContent = collapsed ? "Expand details" : "Collapse details";
}

function renderTimeSection() {
  dueDateElement.textContent = formatDueDate(state.dueDate);
  dueDateElement.dateTime = state.dueDate.toISOString();
  timeRemaining.dateTime = state.dueDate.toISOString();

  if (state.status === "Done") {
    timeRemaining.textContent = "Completed";
    overdueIndicator.classList.add("hidden");
    card.classList.remove("is-overdue");
    return;
  }

  const computed = formatTimeRemaining(Date.now(), state.dueDate);
  timeRemaining.textContent = computed.label;

  overdueIndicator.classList.toggle("hidden", !computed.overdue);
  card.classList.toggle("is-overdue", computed.overdue);
}

function renderCoreState() {
  title.textContent = state.title;
  description.textContent = state.description;

  priorityBadge.textContent = state.priority;
  priorityBadge.setAttribute("aria-label", `Priority: ${state.priority}`);

  statusText.textContent = state.status;
  statusText.setAttribute("aria-label", `Status: ${state.status}`);
  statusControl.value = state.status;

  card.setAttribute("data-priority", state.priority.toLowerCase());
  card.setAttribute("data-status", state.status);

  const isDone = state.status === "Done";
  card.classList.toggle("is-complete", isDone);
  title.classList.toggle("is-complete", isDone);

  syncCheckboxFromStatus(state.status);
  syncCompletionText();

  renderExpandState();
  renderTimeSection();
  updateTimerLifecycle();
}

function renderEditState() {
  card.classList.toggle("is-editing", state.isEditing);
  editForm.classList.toggle("hidden", !state.isEditing);
  editForm.setAttribute("aria-hidden", String(!state.isEditing));

  title.classList.toggle("hidden", state.isEditing);
  editTitleInput.classList.toggle("hidden", !state.isEditing);

  description.classList.toggle("hidden", state.isEditing);
  editDescriptionInput.classList.toggle("hidden", !state.isEditing);

  priorityBadge.classList.toggle("hidden", state.isEditing);
  editPrioritySelect.classList.toggle("hidden", !state.isEditing);

  dueDateElement.classList.toggle("hidden", state.isEditing);
  editDueDateInput.classList.toggle("hidden", !state.isEditing);

  editButton.classList.toggle("hidden", state.isEditing);
  deleteButton.classList.toggle("hidden", state.isEditing);
  saveButton.classList.toggle("hidden", !state.isEditing);
  cancelButton.classList.toggle("hidden", !state.isEditing);

  renderExpandState();
}

function openEditMode() {
  state.isEditing = true;
  editSnapshot = {
    title: state.title,
    description: state.description,
    priority: state.priority,
    dueDate: new Date(state.dueDate.getTime()),
  };

  editTitleInput.value = state.title;
  editDescriptionInput.value = state.description;
  editPrioritySelect.value = state.priority;
  editDueDateInput.value = toDateTimeLocalString(state.dueDate);

  renderEditState();
  editTitleInput.focus();
}

function closeEditMode() {
  state.isEditing = false;
  renderEditState();
  editButton.focus();
}

function cancelEditMode() {
  if (editSnapshot) {
    state.title = editSnapshot.title;
    state.description = editSnapshot.description;
    state.priority = editSnapshot.priority;
    state.dueDate = new Date(editSnapshot.dueDate.getTime());
    editSnapshot = null;
  }

  renderCoreState();
  closeEditMode();
}

function saveEditMode() {
  const nextTitle = editTitleInput.value.trim();
  const nextDescription = editDescriptionInput.value.trim();
  const nextPriority = editPrioritySelect.value;
  const nextDueDate = new Date(editDueDateInput.value);

  if (!nextTitle || !nextDescription || Number.isNaN(nextDueDate.getTime())) {
    return;
  }

  state.title = nextTitle;
  state.description = nextDescription;
  state.priority = nextPriority;
  state.dueDate = nextDueDate;

  editSnapshot = null;
  renderCoreState();
  closeEditMode();
}

function deleteTaskCard() {
  const hasConfirmedDelete = window.confirm(
    "Delete this todo card permanently?",
  );

  if (!hasConfirmedDelete) {
    return;
  }

  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }

  card.remove();
}

checkbox.addEventListener("change", (event) => {
  syncStatusRuleFromCheckbox(event.target.checked);
  renderCoreState();
});

statusControl.addEventListener("change", (event) => {
  state.status = event.target.value;
  renderCoreState();
});

expandToggle.addEventListener("click", () => {
  state.isExpanded = !state.isExpanded;
  renderExpandState();
});

editButton.addEventListener("click", () => {
  openEditMode();
});

saveButton.addEventListener("click", () => {
  saveEditMode();
});

deleteButton.addEventListener("click", () => {
  deleteTaskCard();
});

cancelButton.addEventListener("click", () => {
  cancelEditMode();
});

checkbox.tabIndex = 1;
statusControl.tabIndex = 2;
expandToggle.tabIndex = 3;
editButton.tabIndex = 4;
deleteButton.tabIndex = 5;
saveButton.tabIndex = 6;
cancelButton.tabIndex = 7;

renderCoreState();
renderEditState();
