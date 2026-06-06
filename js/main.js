document.addEventListener('DOMContentLoaded', function() {
  var articles = document.querySelector('.articles');
  var outer = document.querySelector('.articles-outer');
  if (articles && outer) {
    articles.addEventListener('scroll', function() {
      outer.classList.toggle('is-scrolled', articles.scrollTop > 0);
    });
  }
});

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
  if (e.key === 'Escape') {
    closeDrawer();
    closeLightbox();
  }
});

// Lightbox
var lightbox = null;
var lightboxCarousel = null;

function buildLightbox() {
  lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML =
    '<div class="lightbox-inner">' +
      '<button class="lightbox-nav prev" aria-label="Previous"><svg width="14" height="30" viewBox="0 0 10 22" fill="none"><path d="M8 1L1.5 11L8 21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<img>' +
      '<button class="lightbox-nav next" aria-label="Next"><svg width="14" height="30" viewBox="0 0 10 22" fill="none"><path d="M2 1L8.5 11L2 21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '</div>' +
    '<button class="lightbox-close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>';

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

  lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', function() {
    if (!lightboxCarousel) return;
    lightboxCarousel.querySelector('.carousel-btn.prev').click();
    var active = lightboxCarousel.querySelector('.carousel-slide.active img');
    if (active) lightbox.querySelector('img').src = active.src;
  });

  lightbox.querySelector('.lightbox-nav.next').addEventListener('click', function() {
    if (!lightboxCarousel) return;
    lightboxCarousel.querySelector('.carousel-btn.next').click();
    var active = lightboxCarousel.querySelector('.carousel-slide.active img');
    if (active) lightbox.querySelector('img').src = active.src;
  });

  document.body.appendChild(lightbox);
}

function openLightbox(src, carousel) {
  if (!lightbox) buildLightbox();
  lightboxCarousel = carousel || null;
  lightbox.classList.toggle('has-carousel', !!carousel);
  lightbox.querySelector('img').src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', function(e) {
  var img = e.target.closest('.cs-page img:not(.no-lightbox)');
  if (!img) return;
  var carousel = img.closest('.carousel');
  openLightbox(img.src, carousel);
});

document.addEventListener('keydown', function(e) {
  if (!lightbox || !lightbox.classList.contains('open') || !lightboxCarousel) return;
  if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-nav.prev').click();
  if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-nav.next').click();
});
