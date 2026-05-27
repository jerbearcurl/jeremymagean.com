function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('confirm').style.display = 'block';
  e.target.style.opacity = '0.4';
  e.target.style.pointerEvents = 'none';
}

function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  const currentCase = document.body.dataset.case;
  document.querySelectorAll('.case-card').forEach(function(card) {
    card.classList.toggle('active', !!currentCase && card.dataset.case === currentCase);
  });
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeDrawer();
});
