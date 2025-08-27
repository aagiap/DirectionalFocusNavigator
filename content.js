document.addEventListener("keydown", function(e) {
  if (!e.ctrlKey) return;

  const direction = e.key;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(direction)) return;

  e.preventDefault();

  const focusables = Array.from(document.querySelectorAll("a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"))
    .filter(el => !el.disabled && el.offsetParent !== null);

  const current = document.activeElement;
  if (!current || !focusables.includes(current)) return;

  const rect = current.getBoundingClientRect();
  let target = null;
  let minDist = Infinity;

  function dist(r) {
    const dx = r.left - rect.left;
    const dy = r.top - rect.top;
    return Math.sqrt(dx*dx + dy*dy);
  }

  // Ưu tiên cùng hàng/cột
  let strictCandidates = [];
  let looseCandidates = [];

  for (const el of focusables) {
    if (el === current) continue;
    const r = el.getBoundingClientRect();

    if (direction === "ArrowRight" && r.left > rect.right) {
      if (Math.abs(r.top - rect.top) < 30) strictCandidates.push(el);
      else looseCandidates.push(el);
    }

    if (direction === "ArrowLeft" && r.right < rect.left) {
      if (Math.abs(r.top - rect.top) < 30) strictCandidates.push(el);
      else looseCandidates.push(el);
    }

    if (direction === "ArrowDown" && r.top > rect.bottom) {
      if (Math.abs(r.left - rect.left) < 30) strictCandidates.push(el);
      else looseCandidates.push(el);
    }

    if (direction === "ArrowUp" && r.bottom < rect.top) {
      if (Math.abs(r.left - rect.left) < 30) strictCandidates.push(el);
      else looseCandidates.push(el);
    }
  }

  const candidates = strictCandidates.length ? strictCandidates : looseCandidates;

  for (const el of candidates) {
    const d = dist(el.getBoundingClientRect());
    if (d < minDist) {
      minDist = d;
      target = el;
    }
  }

  if (target) {
    target.focus();
    highlight(target);
  }
});

function highlight(el) {
  el.style.outline = "2px solid orange";
  setTimeout(() => el.style.outline = "", 300);
}
