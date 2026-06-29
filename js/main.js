// Shared case studies drawer — single source of truth in drawer.html
(function() {
  var d = location.pathname.split('/').filter(function(s){ return s.length > 0; }).length;
  var p = d > 1 ? Array(d - 1).fill('..').join('/') + '/' : '';
  fetch(p + 'drawer.html', { cache: 'no-cache' }).then(function(r){ return r.text(); }).then(function(html) {
    if (document.getElementById('drawer')) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    tmp.querySelectorAll('a[href]').forEach(function(a) { a.setAttribute('href', p + a.getAttribute('href')); });
    while (tmp.firstChild) { document.body.appendChild(tmp.firstChild); }
    setupCasePreview(p);
  });
})();

// Real preview images per case study (relative to the site root). Cases without an
// entry fall back to the plain gray placeholder.
var CASE_PREVIEW_IMAGES = {
  'wowza-video': 'images/casestudies/wowza-video/hover-preview.png',
  'nexthealth-technologies': 'images/casestudies/nexthealth-technologies/hover-preview.png',
  'flytedesk': 'images/casestudies/flytedesk/hover-preview.png'
};

// Desktop-only hover preview for case study items. Does nothing on touch devices.
function setupCasePreview(p) {
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var body = document.querySelector('.drawer-body');
  var preview = document.getElementById('casePreview');
  if (!body || !preview) return;
  var img = preview.querySelector('.case-preview-img');
  var label = preview.querySelector('.case-preview-label');

  function showCase(name) {
    var src = CASE_PREVIEW_IMAGES[name];
    if (src) {
      img.src = p + src;
      img.hidden = false;
      label.hidden = true;
    } else {
      img.hidden = true;
      img.removeAttribute('src');
      label.hidden = false;
    }
  }

  // Swap content to whichever card is under the cursor (keeps last card's
  // content while hovering the gaps between cards).
  body.addEventListener('mouseover', function(e) {
    var card = e.target.closest('.case-card');
    if (card) showCase(card.dataset.case);
  });
  // Show while the cursor is anywhere in the list; hide when it leaves entirely.
  body.addEventListener('mouseenter', function() {
    preview.classList.add('visible');
  });
  body.addEventListener('mouseleave', function() {
    preview.classList.remove('visible');
  });
}

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
  var preview = document.getElementById('casePreview');
  if (preview) preview.classList.remove('visible');
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
