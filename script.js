const DUE_DATE = new Date("2026-04-17T23:59:00");

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

  if (absoluteDifference === 0) return "Due now!";

  const pluralize = (value, unit) =>
    `${value} ${unit}${value === 1 ? "" : "s"}`;
  const toWholeMinutes = (ms) => Math.max(1, Math.floor(ms / minute));
  const toWholeSeconds = (ms) => Math.max(1, Math.floor(ms / 1000));

  const formatHoursAndMinutes = (ms) => {
    const totalMinutes = toWholeMinutes(ms);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) return pluralize(hours, "hour");
    return `${pluralize(hours, "hour")} and ${pluralize(minutes, "minute")}`;
  };

  if (difference > 0) {
    if (absoluteDifference <= minute) {
      return `Due in ${pluralize(toWholeSeconds(absoluteDifference), "second")}`;
    }

    if (absoluteDifference < hour) {
      return `Due in ${pluralize(toWholeMinutes(absoluteDifference), "minute")}`;
    }

    if (absoluteDifference < day) {
      return `Due in ${formatHoursAndMinutes(absoluteDifference)}`;
    }

    if (absoluteDifference < 2 * day) {
      return "Due tomorrow";
    }

    return `Due in ${pluralize(Math.max(1, Math.floor(absoluteDifference / day)), "day")}`;
  }

  if (absoluteDifference <= minute) {
    return `Overdue by ${pluralize(toWholeSeconds(absoluteDifference), "second")}`;
  }

  if (absoluteDifference < hour) {
    return `Overdue by ${pluralize(toWholeMinutes(absoluteDifference), "minute")}`;
  }

  if (absoluteDifference < day) {
    return `Overdue by ${formatHoursAndMinutes(absoluteDifference)}`;
  }

  return `Overdue by ${pluralize(Math.max(1, Math.floor(absoluteDifference / day)), "day")}`;
}

const checkbox = root.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const status = root.querySelector('[data-testid="test-todo-status"]');
const toggleCopy = root.querySelector("[data-todo-toggle-copy]");
const timeRemaining = root.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);
const dueDateElement = root.querySelector('[data-testid="test-todo-due-date"]');
const title = root.querySelector('[data-testid="test-todo-title"]');
const card = root.querySelector('[data-testid="test-todo-card"]');

if (
  !checkbox ||
  !status ||
  !toggleCopy ||
  !timeRemaining ||
  !dueDateElement ||
  !title ||
  !card
) {
  throw new Error("Required todo card elements were not found");
}

dueDateElement.textContent = formatDueDate(DUE_DATE);
dueDateElement.dateTime = DUE_DATE.toISOString();

let isComplete = false;

function updateTime() {
  card.classList.toggle("is-complete", isComplete);
  title.classList.toggle("is-complete", isComplete);

  if (isComplete) {
    timeRemaining.textContent = "Completed";
    return;
  }

  timeRemaining.textContent = formatTimeRemaining(Date.now(), DUE_DATE);
}

checkbox.addEventListener("change", (event) => {
  isComplete = event.target.checked;
  status.textContent = isComplete ? "Done" : "Pending";
  status.setAttribute("aria-label", `Status: ${status.textContent}`);
  toggleCopy.textContent = isComplete
    ? "This task is marked complete."
    : "This task is not complete.";
  updateTime();
});

document
  .querySelector('[data-testid="test-todo-edit-button"]')
  .addEventListener("click", () => {
    console.log("edit clicked");
  });

document
  .querySelector('[data-testid="test-todo-delete-button"]')
  .addEventListener("click", () => {
    window.alert("Delete clicked");
  });

updateTime();
window.setInterval(updateTime, 10000);
