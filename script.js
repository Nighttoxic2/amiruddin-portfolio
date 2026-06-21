const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const animateCounter = (el, target) => {
  const duration = 1400;
  const start = performance.now();
  const from = 0;
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(from + (target - from) * eased);
    el.textContent = value >= 100 ? `${value}+` : `${value}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-counter]').forEach((node) => {
      animateCounter(node, Number(node.dataset.counter));
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.4 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

const galleryDialog = document.getElementById('galleryDialog');
const galleryDialogImage = document.getElementById('galleryDialogImage');
const galleryDialogTitle = document.getElementById('galleryDialogTitle');
const galleryDialogDescription = document.getElementById('galleryDialogDescription');
const galleryDialogClose = document.querySelector('.dialog-close');

const openGallery = (card) => {
  const key = card.dataset.gallery;
  const title = card.dataset.title || 'Preview';
  const description = card.dataset.description || '';
  const image = `assets/previews/${key}.svg`;
  galleryDialogTitle.textContent = title;
  galleryDialogDescription.textContent = description;
  galleryDialogImage.src = image;
  galleryDialogImage.alt = `${title} preview`;
  if (typeof galleryDialog.showModal === 'function') {
    galleryDialog.showModal();
  }
};

document.querySelectorAll('.gallery-card').forEach((card) => {
  card.addEventListener('click', () => openGallery(card));
});

galleryDialogClose?.addEventListener('click', () => galleryDialog.close());
galleryDialog?.addEventListener('click', (event) => {
  const rect = galleryDialog.getBoundingClientRect();
  const isInDialog = (
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width
  );
  if (!isInDialog) galleryDialog.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && galleryDialog?.open) galleryDialog.close();
});

// Gentle tilt for desktop cards only.
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.feature-card, .cert-card, .github-card, .recruiter-card, .skill-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-2px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
