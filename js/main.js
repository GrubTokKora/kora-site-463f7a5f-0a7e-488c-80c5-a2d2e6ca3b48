window.KORA_SITE_CONFIG = {
  apiBaseUrl: 'https://kora-agent.grubtok.com',
  businessId: '463f7a5f-0a7e-488c-80c5-a2d2e6ca3b48',
  recaptchaSiteKey: '6LcsdJYsAAAAAAur-h7cYlZuGJTmijNHmOi5kFH7',
};

function initMobileMenu() {
  const menuBtn = document.querySelector('[data-mobile-menu-btn]');
  const menu = document.querySelector('[data-mobile-menu]');
  const closeBtn = document.querySelector('[data-mobile-close]');
  const backdrop = document.querySelector('[data-mobile-backdrop]');
  if (!menu || !menuBtn) return;

  function openMenu() {
    menu.classList.add('active');
    menu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
  });
}

function initNavbarScroll() {
  const header = document.querySelector('header.site-header') || document.querySelector('#site-header header');
  if (!header) return;

  // Solid black is the site default. Transparent only when body opts in.
  const useTransparent = document.body.dataset.header === 'transparent';
  if (!useTransparent) {
    header.classList.add('is-solid');
    header.classList.remove('is-transparent');
    return;
  }

  header.classList.remove('is-solid');
  header.classList.add('is-transparent');
  const update = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  els.forEach(function (el) {
    io.observe(el);
  });
}

function initLightbox() {
  const items = document.querySelectorAll('[data-lightbox]');
  if (!items.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML =
    '<button type="button" class="lightbox__close" aria-label="Close image">×</button><img alt="">';
  document.body.appendChild(overlay);

  const img = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox__close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    img.src = '';
    document.body.style.overflow = '';
  }

  items.forEach(function (el) {
    el.addEventListener('click', function () {
      const src = el.getAttribute('data-lightbox') || el.querySelector('img')?.src;
      const alt = el.querySelector('img')?.alt || '';
      if (src) open(src, alt);
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });
}

function setFormStatus(form, text, kind) {
  const statusEl = form.querySelector('.form-status, [data-form-status]');
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.classList.toggle('is-visible', Boolean(text));
  statusEl.classList.remove(
    'form-status--error',
    'form-status--success',
    'form-status--neutral',
    'is-error',
    'is-success'
  );
  if (kind === 'error') statusEl.classList.add('form-status--error', 'is-error');
  else if (kind === 'success') statusEl.classList.add('form-status--success', 'is-success');
  else if (kind) statusEl.classList.add('form-status--neutral');
}

function setSubmittingState(form, isSubmitting, busyLabel) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;
  if (isSubmitting) {
    submitBtn.dataset.originalText = submitBtn.textContent || 'Submit';
    submitBtn.textContent = busyLabel || 'Sending...';
    submitBtn.disabled = true;
    return;
  }
  submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
  submitBtn.disabled = false;
}

function parseApiError(data, fallback) {
  const detail = data && data.detail;
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const joined = detail.map(function (d) { return d.msg || d.message || ''; }).filter(Boolean).join(' ');
    if (joined) return joined;
  }
  if (data && typeof data.message === 'string' && data.message.trim()) return data.message;
  return fallback;
}

let recaptchaScriptPromise = null;
const RECAPTCHA_W = 304;
const RECAPTCHA_H = 78;
const responsiveRecaptchaBoxes = [];

function scaleRecaptcha(box) {
  const wrap = box.parentElement;
  if (!wrap || !wrap.classList.contains('g-recaptcha-scale')) return;
  const available = wrap.clientWidth;
  if (!available) return;
  const scale = Math.min(1, available / RECAPTCHA_W);
  box.style.transform = scale < 1 ? 'scale(' + scale.toFixed(4) + ')' : 'none';
  wrap.style.height = Math.ceil(RECAPTCHA_H * scale) + 'px';
}

function makeRecaptchaResponsive(box) {
  if (!box || box.dataset.koraRecaptchaResponsive === 'true') return;
  box.dataset.koraRecaptchaResponsive = 'true';

  let wrap = box.parentElement;
  if (!wrap || !wrap.classList.contains('g-recaptcha-scale')) {
    wrap = document.createElement('div');
    wrap.className = 'g-recaptcha-scale';
    box.parentNode.insertBefore(wrap, box);
    wrap.appendChild(box);
  }

  scaleRecaptcha(box);
  const observer = new MutationObserver(function () { scaleRecaptcha(box); });
  observer.observe(box, { childList: true, subtree: true });
  responsiveRecaptchaBoxes.push(box);
}

let recaptchaResizeTimer = null;
window.addEventListener('resize', function () {
  window.clearTimeout(recaptchaResizeTimer);
  recaptchaResizeTimer = window.setTimeout(function () {
    responsiveRecaptchaBoxes.forEach(scaleRecaptcha);
  }, 150);
});

function ensureRecaptchaScript(siteKey) {
  if (!siteKey) return Promise.resolve();
  if (typeof window.grecaptcha !== 'undefined') return Promise.resolve();
  if (recaptchaScriptPromise) return recaptchaScriptPromise;
  recaptchaScriptPromise = new Promise(function (resolve, reject) {
    const existing = document.querySelector('script[data-kora-recaptcha="true"]');
    if (existing) {
      existing.addEventListener('load', function () { resolve(); });
      existing.addEventListener('error', function () { reject(new Error('reCAPTCHA failed to load')); });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.dataset.koraRecaptcha = 'true';
    script.onload = function () { resolve(); };
    script.onerror = function () { reject(new Error('reCAPTCHA failed to load')); };
    document.head.appendChild(script);
  });
  return recaptchaScriptPromise;
}

function getRecaptchaToken(form) {
  if (typeof window.grecaptcha === 'undefined') return '';
  const recaptchaEl = form.querySelector('.g-recaptcha');
  if (!recaptchaEl) return '';
  return window.grecaptcha.getResponse() || '';
}

function resetRecaptcha(form) {
  if (typeof window.grecaptcha === 'undefined') return;
  if (form.querySelector('.g-recaptcha')) window.grecaptcha.reset();
}

/**
 * Kora public forms API — POST {apiBaseUrl}/api/v1/public/forms/submit
 * Requires reCAPTCHA v2 token (captcha_token) + business_id matching the Kora site.
 */
function initContactForm() {
  const form = document.getElementById('contact-form') || document.querySelector('[data-contact-form]');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';

  const config = window.KORA_SITE_CONFIG || {};
  const apiBaseUrl = (config.apiBaseUrl || '').replace(/\/+$/, '');
  const businessId = config.businessId || '';
  const recaptchaSiteKey = (config.recaptchaSiteKey || '').trim();
  const recaptchaEl = form.querySelector('.g-recaptcha');

  if (recaptchaEl && recaptchaSiteKey) {
    recaptchaEl.setAttribute('data-sitekey', recaptchaSiteKey);
    makeRecaptchaResponsive(recaptchaEl);
    form.addEventListener(
      'focusin',
      function () {
        ensureRecaptchaScript(recaptchaSiteKey).catch(function () {
          setFormStatus(form, 'Security check failed to load. Please refresh and try again.', 'error');
        });
      },
      { once: true }
    );
  } else if (recaptchaEl && !recaptchaSiteKey) {
    recaptchaEl.style.display = 'none';
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const firstName = ((form.querySelector('[name="first_name"]') || {}).value || '').trim();
    const lastName = ((form.querySelector('[name="last_name"]') || {}).value || '').trim();
    const email = ((form.querySelector('[name="email"]') || {}).value || '').trim();
    const phone = ((form.querySelector('[name="phone"]') || {}).value || '').trim();
    const message = ((form.querySelector('[name="message"]') || {}).value || '').trim();
    const name =
      ((form.querySelector('[name="name"]') || {}).value || '').trim() ||
      (firstName + ' ' + lastName).trim() ||
      firstName ||
      lastName;

    if (!name || !email || !message) {
      setFormStatus(form, 'Please fill in your name, email, and message.', 'error');
      return;
    }

    if (!businessId || !apiBaseUrl) {
      setFormStatus(form, 'Form submission is not configured for this site.', 'error');
      return;
    }

    if (recaptchaEl && !recaptchaSiteKey) {
      setFormStatus(form, 'Form temporarily unavailable.', 'error');
      return;
    }

    if (recaptchaEl && recaptchaSiteKey) {
      try {
        await ensureRecaptchaScript(recaptchaSiteKey);
      } catch (err) {
        setFormStatus(form, 'Security check failed to load. Please refresh and try again.', 'error');
        return;
      }
      const captchaCheck = getRecaptchaToken(form);
      if (!captchaCheck) {
        setFormStatus(form, 'Please complete the security check.', 'error');
        return;
      }
    }

    const captchaToken = getRecaptchaToken(form);
    setSubmittingState(form, true, 'Sending...');
    setFormStatus(form, 'Sending...', 'neutral');

    const formData = {
      name: name,
      email: email,
      message: message,
    };
    if (phone) formData.phone = phone;
    if (firstName) formData.first_name = firstName;
    if (lastName) formData.last_name = lastName;

    try {
      const response = await fetch(apiBaseUrl + '/api/v1/public/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          form_type: 'contact',
          form_data: formData,
          submitter_email: email,
          captcha_token: captchaToken || '',
        }),
      });
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        throw new Error(parseApiError(data, 'Something went wrong. Please try again or call us at (475) 328-9854.'));
      }
      form.reset();
      resetRecaptcha(form);
      setFormStatus(form, data.message || 'Thank you! Your message has been received.', 'success');
    } catch (error) {
      resetRecaptcha(form);
      setFormStatus(
        form,
        (error && error.message) || 'Something went wrong. Please try again or call us at (475) 328-9854.',
        'error'
      );
    } finally {
      setSubmittingState(form, false);
    }
  });
}

function initHeroVideo() {
  const wrap = document.querySelector('.hero__yt');
  if (!wrap) return;
  // Prefer cinematic video when ready; keep photo as continuous fallback.
  const video = wrap.querySelector('video');
  if (!video) return;
  const activate = function () {
    wrap.classList.add('is-active');
  };
  if (video.readyState >= 2) {
    activate();
  } else {
    video.addEventListener('canplay', activate, { once: true });
    video.addEventListener('playing', activate, { once: true });
  }
  const playAttempt = video.play();
  if (playAttempt && typeof playAttempt.catch === 'function') {
    playAttempt.catch(function () {});
  }
}

function getHeaderOffset() {
  // Prefer the fixed <header>, not body[data-header] (same attribute is on <body>).
  const header = document.querySelector('header.site-header') || document.querySelector('#site-header header');
  if (header) return Math.ceil(header.getBoundingClientRect().height);
  const css = getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim();
  if (css.endsWith('rem')) {
    const rem = parseFloat(css);
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    if (Number.isFinite(rem)) return Math.ceil(rem * root);
  }
  const px = parseFloat(css);
  return Number.isFinite(px) ? Math.ceil(px) : 76;
}

function getPageScrollY() {
  return window.pageYOffset || document.documentElement.scrollTop || 0;
}

/**
 * Scroll so el sits just under the fixed site header.
 * Absolute document Y avoids sticky-clamped rects and collapsed panels.
 */
function scrollElementUnderHeader(el, behavior) {
  if (!el) return;
  const offset = getHeaderOffset() + 8;
  const absoluteTop = el.getBoundingClientRect().top + getPageScrollY();
  const top = Math.max(0, absoluteTop - offset);
  window.scrollTo({ top: top, behavior: behavior || 'smooth' });
}

/** After layout settles, pin an element under the header. */
function afterLayout(fn) {
  requestAnimationFrame(function () {
    requestAnimationFrame(fn);
  });
}

/** Horizontally center a chip in its overflow scroller (no page jump). */
function centerChipInScroller(btn, scroller) {
  if (!btn || !scroller) return;
  const left = btn.offsetLeft - scroller.clientWidth / 2 + btn.offsetWidth / 2;
  scroller.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
}

/*
 * Menu page. Kora draws the menus from the site's menu data into the kora:data:menu region:
 * a .kora-menu__switcher of board tabs (Kora's own script shows one menu at a time) and, in a
 * menu with several sections, a .kora-menu__nav of category links. Here the category links
 * become line-tabs that show one category at a time, as the hand-written menu did.
 */

/** Wrap a category nav's links in a track with the sliding red underline. */
function ensureCategoryTrack(nav) {
  if (!nav) return null;
  let track = nav.querySelector('.kora-menu__nav-track');
  if (!track) {
    track = document.createElement('div');
    track.className = 'kora-menu__nav-track';
    while (nav.firstChild) track.appendChild(nav.firstChild);
    nav.appendChild(track);
  }
  let indicator = track.querySelector('.kora-menu__nav-indicator');
  if (!indicator) {
    indicator = document.createElement('span');
    indicator.className = 'kora-menu__nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    track.appendChild(indicator);
  }
  return track;
}

/** Slide the thick red underline under the active category. */
function updateCategoryIndicator(menu) {
  const nav = menu && menu.querySelector('.kora-menu__nav');
  const track = ensureCategoryTrack(nav);
  if (!track) return;

  const indicator = track.querySelector('.kora-menu__nav-indicator');
  const active = track.querySelector('a.is-active');
  if (!indicator || !active || menu.hidden) {
    if (indicator && !active) indicator.classList.remove('is-ready');
    return;
  }

  const first = !indicator.classList.contains('is-ready');
  if (first) indicator.style.transition = 'none';
  indicator.style.width = active.offsetWidth + 'px';
  indicator.style.transform = 'translateX(' + active.offsetLeft + 'px)';
  indicator.classList.add('is-ready');
  if (first) {
    void indicator.offsetWidth;
    indicator.style.transition = '';
  }
}

/** Show one category of a menu, with the cards fading in one after another. */
function showCategory(menu, sectionId, options) {
  options = options || {};
  const nav = menu.querySelector('.kora-menu__nav');
  if (!nav) return;
  const section = sectionId && menu.querySelector('#' + CSS.escape(sectionId));
  const target = section || menu.querySelector('.kora-menu__section');
  if (!target) return;

  nav.querySelectorAll('a').forEach(function (link) {
    const on = link.getAttribute('href') === '#' + target.id;
    link.classList.toggle('is-active', on);
    if (on) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  menu.querySelectorAll('.kora-menu__section').forEach(function (s) {
    s.classList.toggle('is-filtered-out', s !== target);
  });
  target.querySelectorAll('.kora-menu__item').forEach(function (card, index) {
    card.classList.remove('fade-in');
    void card.offsetWidth;
    card.classList.add('fade-in');
    card.style.animationDelay = index * 0.05 + 's';
  });
  updateCategoryIndicator(menu);

  if (options.scroll) {
    const active = nav.querySelector('a.is-active');
    afterLayout(function () {
      scrollElementUnderHeader(nav, 'smooth');
      if (active) centerChipInScroller(active, nav);
      updateCategoryIndicator(menu);
    });
  }
}

/** Pin the board tabs under the header + center the active tab. */
function scrollToBoardTabs(root) {
  const switcher = root.querySelector('.kora-menu__switcher');
  if (!switcher) return;
  const active = switcher.querySelector('a[aria-current="true"]');
  afterLayout(function () {
    scrollElementUnderHeader(switcher, 'smooth');
    if (active) centerChipInScroller(active, switcher);
  });
}

function initMenuFilters() {
  const root = document.querySelector('#menu-section .kora-menu');
  if (!root || root.dataset.menuBound === 'true') return;
  root.dataset.menuBound = 'true';
  root.classList.add('is-enhanced');

  const hash = location.hash.slice(1);
  root.querySelectorAll('.kora-menu__menu, .kora-menu > .kora-menu__section').forEach(function (menu) {
    const nav = menu.querySelector('.kora-menu__nav');
    if (!nav) return;
    menu.classList.add('is-filterable');
    ensureCategoryTrack(nav);
    const fromHash = hash && menu.querySelector('.kora-menu__section#' + CSS.escape(hash));
    showCategory(menu, fromHash ? hash : null);

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const id = link.getAttribute('href').slice(1);
        showCategory(menu, id, { scroll: true });
        history.replaceState(null, '', '#' + id);
      });
    });
  });

  // Kora's tab script switches the menu first (its listener was added earlier); then settle the view.
  root.querySelectorAll('.kora-menu__switcher a').forEach(function (tab) {
    tab.addEventListener('click', function () {
      afterLayout(function () {
        root.querySelectorAll('.is-filterable').forEach(updateCategoryIndicator);
      });
      scrollToBoardTabs(root);
    });
  });

  window.addEventListener(
    'resize',
    function () {
      root.querySelectorAll('.is-filterable').forEach(updateCategoryIndicator);
    },
    { passive: true }
  );
}

function boot() {
  initMobileMenu();
  initNavbarScroll();
  initReveal();
  initLightbox();
  initContactForm();
  initHeroVideo();
  initMenuFilters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    // Partials render on DOMContentLoaded; boot after paint
    requestAnimationFrame(boot);
  });
  document.addEventListener('site:partials-loaded', boot);
} else {
  boot();
}

document.addEventListener('site:partials-loaded', function () {
  initMobileMenu();
  initNavbarScroll();
});
