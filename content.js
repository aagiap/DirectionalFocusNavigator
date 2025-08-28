document.addEventListener("keydown", function(e) {
  if (!e.ctrlKey) return;

  const direction = e.key;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(direction)) return;

  e.preventDefault();

  // Lấy danh sách focusable
  const focusables = Array.from(document.querySelectorAll(
    "a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"
  )).filter(el => !el.disabled && el.offsetParent !== null);

  if (focusables.length === 0) return;

  let current = document.activeElement;

  // Nếu chưa có focus thì focus phần tử đầu tiên (giống Tab)
  if (!current || !focusables.includes(current)) {
    focusables[0].focus();
    
    return;
  }

  const rect = current.getBoundingClientRect();
  let target = null;
  let minDist = Infinity;

  function dist(r) {
    const dx = r.left - rect.left;
    const dy = r.top - rect.top;
    return Math.sqrt(dx * dx + dy * dy);
  }

  let candidates = [];

  for (const el of focusables) {
    if (el === current) continue;
    const r = el.getBoundingClientRect();

    if (direction === "ArrowRight" && r.left > rect.right) {
      if (Math.abs(r.top - rect.top) <= 200) candidates.push(el);
    }

    if (direction === "ArrowLeft" && r.right < rect.left) {
      if (Math.abs(r.top - rect.top) <= 200) candidates.push(el);
    }

    if (direction === "ArrowDown" && r.top > rect.bottom) {
      if (Math.abs(r.left - rect.left) <= 200) candidates.push(el);
    }

    if (direction === "ArrowUp" && r.bottom < rect.top) {
      if (Math.abs(r.left - rect.left) <= 200) candidates.push(el);
    }
  }

  // Chọn phần tử gần nhất trong candidates
  for (const el of candidates) {
    const d = dist(el.getBoundingClientRect());
    if (d < minDist) {
      minDist = d;
      target = el;
    }
  }

  if (target) {
    target.focus();
  
  }
});


