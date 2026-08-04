const ORDER_URL = 'https://order.toasttab.com/online/antonios-971-boston-post-road';
const GIFT_URL = 'https://order.toasttab.com/egiftcards/antonios-971-boston-post-road';
const LOCATIONS_URL = 'https://antoniosrestaurantgroup.com/';
const MAP_URL = 'https://www.google.com/maps/dir/?api=1&destination=Antonio%27s%20Italian%20Bistro+971%20Boston%20Post%20Rd+Darien+CT+06820-4506';
const PHONE_HREF = 'tel:+14753289854';
const PHONE_DISPLAY = '(475) 328-9854';
const LOGO = 'https://quseprdus1.blob.core.windows.net/kora-business-images/user-media/463f7a5f-0a7e-488c-80c5-a2d2e6ca3b48/de8c94d8-887e-4625-825f-ec262dbc28df/1785837173_pua2ko.png';

const ICON_MENU = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>';
const ICON_CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>';

const HEADER_HTML = `
<header class="site-header is-solid" data-header>
  <nav class="navbar" aria-label="Main navigation">
    <div class="navbar-inner">
      <a href="index.html" class="brand" aria-label="Antonio's Italian Bistro Home">
        <img src="${LOGO}" alt="Antonio's Italian Bistro" class="brand__logo" width="160" height="56" loading="eager" decoding="async">
      </a>

      <div class="nav-desktop">
        <a href="about.html" data-nav="about" class="nav-link">About</a>
        <a href="menu.html" data-nav="menu" class="nav-link">Menu</a>
        <a href="gallery.html" data-nav="gallery" class="nav-link">Gallery</a>
        <a href="events.html" data-nav="events" class="nav-link">Events</a>
        <a href="private-events.html" data-nav="private-events" class="nav-link">Private Events</a>
        <a href="pizza-truck.html" data-nav="pizza-truck" class="nav-link">Pizza Truck</a>
        <a href="contact.html" data-nav="contact" class="nav-link">Contact</a>
        <a href="${ORDER_URL}" class="nav-link" target="_blank" rel="noopener noreferrer">Order Online</a>
        <a href="${GIFT_URL}" class="nav-link" target="_blank" rel="noopener noreferrer">Gift Cards</a>
        <a href="${LOCATIONS_URL}" class="nav-link" target="_blank" rel="noopener noreferrer">Our Locations</a>
        <a href="reservations.html" data-nav="reservations" class="btn btn-primary btn-sm nav-cta">Reserve</a>
      </div>

      <button type="button" class="menu-btn" data-mobile-menu-btn aria-label="Open menu" aria-expanded="false">
        ${ICON_MENU}
      </button>
    </div>
  </nav>
</header>

<div class="mobile-menu" data-mobile-menu aria-hidden="true">
  <div class="mobile-menu__backdrop" data-mobile-backdrop></div>
  <div class="mobile-menu__panel">
    <button type="button" class="mobile-menu__close" data-mobile-close aria-label="Close menu">${ICON_CLOSE}</button>
    <nav class="mobile-menu__nav" aria-label="Mobile navigation">
      <a href="about.html" data-nav="about" class="mobile-menu__link">About</a>
      <a href="menu.html" data-nav="menu" class="mobile-menu__link">Menu</a>
      <a href="gallery.html" data-nav="gallery" class="mobile-menu__link">Gallery</a>
      <a href="events.html" data-nav="events" class="mobile-menu__link">Events</a>
      <a href="private-events.html" data-nav="private-events" class="mobile-menu__link">Private Events</a>
      <a href="pizza-truck.html" data-nav="pizza-truck" class="mobile-menu__link">Pizza Truck</a>
      <a href="reservations.html" data-nav="reservations" class="mobile-menu__link">Reservations</a>
      <a href="contact.html" data-nav="contact" class="mobile-menu__link">Contact</a>
      <a href="${ORDER_URL}" class="mobile-menu__link" target="_blank" rel="noopener noreferrer">Order Online</a>
      <a href="${GIFT_URL}" class="mobile-menu__link" target="_blank" rel="noopener noreferrer">Gift Cards</a>
      <a href="${LOCATIONS_URL}" class="mobile-menu__link" target="_blank" rel="noopener noreferrer">Our Locations</a>
    </nav>
    <div class="mobile-menu__actions">
      <a href="reservations.html" class="btn btn-primary">Reserve a Table</a>
      <a href="${ORDER_URL}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">Order Online</a>
      <a href="${PHONE_HREF}" class="btn btn-outline">${PHONE_DISPLAY}</a>
    </div>
  </div>
</div>
`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <img src="${LOGO}" alt="Antonio's Italian Bistro" class="footer-logo" width="140" height="52" loading="lazy" decoding="async">
      <p>Sophisticated Italian dining in Darien, CT—tradition reimagined with modern craft and warm hospitality.</p>
    </div>
    <div>
      <div class="footer-head">Visit</div>
      <div class="footer-line">971 Boston Post Rd</div>
      <div class="footer-line">Darien, CT 06820-4506</div>
      <div class="footer-line">Daily 11:00 AM – 9:00 PM</div>
      <div class="footer-line"><a href="${MAP_URL}" target="_blank" rel="noopener noreferrer">Get directions</a></div>
    </div>
    <div>
      <div class="footer-head">Contact</div>
      <div class="footer-line"><a href="${PHONE_HREF}">${PHONE_DISPLAY}</a></div>
      <div class="footer-line"><a href="${ORDER_URL}" target="_blank" rel="noopener noreferrer">Order online</a></div>
      <div class="footer-line"><a href="${GIFT_URL}" target="_blank" rel="noopener noreferrer">Gift cards</a></div>
      <div class="footer-line"><a href="${LOCATIONS_URL}" target="_blank" rel="noopener noreferrer">Our locations</a></div>
    </div>
    <div>
      <div class="footer-head">Explore</div>
      <nav class="footer-nav" aria-label="Footer">
        <a href="about.html">About</a>
        <a href="menu.html">Menu</a>
        <a href="private-events.html">Private Events</a>
        <a href="pizza-truck.html">Pizza Truck</a>
        <a href="gallery.html">Gallery</a>
        <a href="contact.html">Contact</a>
        <a href="privacy-policy.html">Privacy Policy</a>
      </nav>
    </div>
  </div>
  <div class="footer-bar">
    <span>© ${new Date().getFullYear()} Antonio's Italian Bistro. All rights reserved.</span>
    <span>Darien · Fairfield County · CT</span>
  </div>
</footer>
`;

function applyActiveNav(page) {
  if (!page) return;
  document.querySelectorAll('[data-nav="' + page + '"]').forEach(function (link) {
    link.classList.add('is-active');
  });
}

function renderPartials() {
  var headerMount = document.getElementById('site-header');
  var footerMount = document.getElementById('site-footer');
  if (headerMount) {
    headerMount.outerHTML = HEADER_HTML;
    applyActiveNav(document.body.dataset.page || '');
  }
  if (footerMount) {
    footerMount.outerHTML = FOOTER_HTML;
  }
  document.dispatchEvent(new CustomEvent('site:partials-loaded'));
}

document.addEventListener('DOMContentLoaded', renderPartials);
