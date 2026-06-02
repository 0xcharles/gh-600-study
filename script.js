/* ===== GH-600 V2 Shared JavaScript ===== */

// Progress ring in header
function updateProgressRing() {
  const total = document.querySelectorAll('[data-day]').length || 14;
  let completed = 0;
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('gh600_day_')) completed++;
  });
  const pct = Math.min(100, Math.round((completed / total) * 100));

  const ring = document.querySelector('.progress-ring');
  if (!ring) return;
  const circle = ring.querySelector('circle');
  const text = ring.querySelector('text');
  if (circle) {
    const r = circle.getAttribute('r');
    const circ = 2 * Math.PI * r;
    circle.style.strokeDasharray = `${circ} ${circ}`;
    circle.style.strokeDashoffset = circ - (pct / 100) * circ;
  }
  if (text) text.textContent = `${pct}%`;
}

// Diagram lightbox
document.addEventListener('click', e => {
  const wrap = e.target.closest('.diagram-wrap');
  if (!wrap || e.target.closest('a')) return;
  const svg = wrap.querySelector('svg');
  if (!svg) return;
  const clone = svg.cloneNode(true);
  clone.querySelectorAll('defs').forEach(d => d.remove());
  const lb = document.createElement('div');
  lb.className = 'lightbox open';
  lb.onclick = () => lb.remove();
  lb.appendChild(clone);
  document.body.appendChild(lb);
});

// Scroll-triggered reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: .1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    observer.observe(el);
  });
  updateProgressRing();
});

// Progress tracking helper
function markDayComplete(day) {
  localStorage.setItem(`gh600_day_${day}`, '1');
  updateProgressRing();
}
