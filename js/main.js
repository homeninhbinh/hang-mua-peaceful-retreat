/**
 * Hang Mua Peaceful Retreat – Main JS
 * Gallery lightbox, review slider, mobile nav, header scroll
 */

(function () {
  'use strict';

  /* ── Header scroll effect ── */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile navigation ── */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('nav__menu--open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav__menu--open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Gallery lightbox ── */
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const galleryData = Array.from(galleryItems).map((item) => ({
    src: item.querySelector('img').src.replace('w=600', 'w=1200').replace('w=800', 'w=1200'),
    alt: item.querySelector('img').alt,
    caption: item.querySelector('.gallery__caption').textContent,
  }));

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = galleryData[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.caption;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightbox();
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ── Review slider ── */
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewPrev = document.getElementById('reviewPrev');
  const reviewNext = document.getElementById('reviewNext');
  const reviewDots = document.getElementById('reviewDots');
  const reviewCards = reviewsTrack.querySelectorAll('.review-card');
  const totalReviews = reviewCards.length;
  let reviewIndex = 0;
  let autoSlideTimer;

  function createDots() {
    for (let i = 0; i < totalReviews; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews__dot' + (i === 0 ? ' reviews__dot--active' : '');
      dot.setAttribute('aria-label', `Đánh giá ${i + 1}`);
      dot.addEventListener('click', () => goToReview(i));
      reviewDots.appendChild(dot);
    }
  }

  function updateDots() {
    reviewDots.querySelectorAll('.reviews__dot').forEach((dot, i) => {
      dot.classList.toggle('reviews__dot--active', i === reviewIndex);
    });
  }

  function goToReview(index) {
    reviewIndex = index;
    reviewsTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
    updateDots();
    resetAutoSlide();
  }

  function nextReview() {
    goToReview((reviewIndex + 1) % totalReviews);
  }

  function prevReview() {
    goToReview((reviewIndex - 1 + totalReviews) % totalReviews);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextReview, 5000);
  }

  createDots();
  reviewPrev.addEventListener('click', prevReview);
  reviewNext.addEventListener('click', nextReview);
  resetAutoSlide();

  /* Pause auto-slide on hover */
  const reviewsSlider = document.querySelector('.reviews__slider');
  reviewsSlider.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  reviewsSlider.addEventListener('mouseleave', resetAutoSlide);

  /* ── Smooth anchor links with Zalo CTA tracking (optional) ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();

