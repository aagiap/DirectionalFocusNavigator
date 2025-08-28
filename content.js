document.addEventListener("keydown", function(e) {
  if (!e.ctrlKey) return;

  const key = e.key;

  // ==== 1. Ctrl + I -> duyệt input ====
  if (key.toLowerCase() === "i") {
    e.preventDefault();

    const inputs = Array.from(document.querySelectorAll("input, textarea, select"))
      .filter(el => !el.disabled && el.offsetParent !== null);

    if (inputs.length === 0) return;

    let current = document.activeElement;
    let idx = inputs.indexOf(current);

    // Nếu chưa focus thì chọn input đầu tiên
    if (idx === -1) {
      inputs[0].focus();
    } else {
      // Chuyển sang input kế tiếp (vòng tròn)
      let next = (idx + 1) % inputs.length;
      inputs[next].focus();
    }
    return;
  }

  // ==== 2. Ctrl + Arrow -> duyệt focusable (bỏ qua input) ====
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) return;

  e.preventDefault();

  // Lấy danh sách focusable, nhưng bỏ input/textarea/select
  const focusables = Array.from(document.querySelectorAll(
    "a, button, [tabindex]:not([tabindex='-1'])"
  )).filter(el => !el.disabled && el.offsetParent !== null);

  if (focusables.length === 0) return;

  let current = document.activeElement;

  // Nếu chưa có focus thì focus phần tử đầu tiên
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

    if (key === "ArrowRight" && r.left > rect.right) {
      if (Math.abs(r.top - rect.top) <= 40) candidates.push(el);
    }

    if (key === "ArrowLeft" && r.right < rect.left) {
      if (Math.abs(r.top - rect.top) <= 40) candidates.push(el);
    }

    if (key === "ArrowDown" && r.top > rect.bottom) {
      if (Math.abs(r.left - rect.left) <= 40) candidates.push(el);
    }

    if (key === "ArrowUp" && r.bottom < rect.top) {
      if (Math.abs(r.left - rect.left) <= 40) candidates.push(el);
    }
  }

  // Chọn phần tử gần nhất
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
