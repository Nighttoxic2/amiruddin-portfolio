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

const galleryDialog = document.getElementById('galleryDialog');
const galleryDialogImage = document.getElementById('galleryDialogImage');
const galleryDialogTitle = document.getElementById('galleryDialogTitle');
const galleryDialogDescription = document.getElementById('galleryDialogDescription');
const galleryDialogClose = document.querySelector('.dialog-close');

function openGallery(card) {
  const key = card.dataset.gallery;
  const title = card.dataset.title || 'Preview';
  const description = card.dataset.description || '';
  galleryDialogTitle.textContent = title;
  galleryDialogDescription.textContent = description;
  galleryDialogImage.src = `assets/previews/${key}.svg`;
  galleryDialogImage.alt = `${title} preview`;
  if (typeof galleryDialog.showModal === 'function') {
    galleryDialog.showModal();
  }
}

document.querySelectorAll('.gallery-card').forEach((card) => {
  card.addEventListener('click', () => openGallery(card));
});

galleryDialogClose?.addEventListener('click', () => galleryDialog.close());
galleryDialog?.addEventListener('click', (event) => {
  const rect = galleryDialog.getBoundingClientRect();
  const clickedInside = (
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width
  );
  if (!clickedInside) galleryDialog.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && galleryDialog?.open) galleryDialog.close();
});

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.info-card, .case-card, .tool-card, .cert-card, .timeline-item, .stat-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-2px) rotateX(${(-y * 2).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
