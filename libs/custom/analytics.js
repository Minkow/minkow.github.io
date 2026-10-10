(function () {
  'use strict';

  var measurementId = 'G-YKCGX8H515';
  var preferenceKey = 'minkow.analytics.disabled';
  var query = new URLSearchParams(window.location.search);
  var mode = query.get('analytics');
  var disabled = false;
  try {
    if (mode === 'off') localStorage.setItem(preferenceKey, 'true');
    if (mode === 'on') localStorage.removeItem(preferenceKey);
    disabled = localStorage.getItem(preferenceKey) === 'true';
  } catch (error) {
    // A URL override still works when browser storage is unavailable.
  }
  if (mode === 'off') disabled = true;
  if (mode === 'on') disabled = false;

  if (mode === 'off' || mode === 'on') {
    query.delete('analytics');
    var remaining = query.toString();
    history.replaceState(null, '', window.location.pathname + (remaining ? '?' + remaining : '') + window.location.hash);
    var notice = document.createElement('div');
    notice.setAttribute('role', 'status');
    notice.textContent = disabled ? 'Analytics is off for this browser.' : 'Analytics is on for this browser.';
    notice.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;z-index:1000;padding:12px 16px;background:#153b35;color:white;border-radius:8px;font:14px system-ui;';
    document.body.appendChild(notice);
    setTimeout(function () { notice.remove(); }, 6000);
  }

  if (disabled || !/^(www\.)?minkow\.me$/.test(window.location.hostname)) {
    window['ga-disable-' + measurementId] = true;
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(tag);

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('.publication-links a');
    if (!link) return;
    var card = link.closest('.publication-card');
    var title = card && card.querySelector('h3');
    if (!title) return;
    window.gtag('event', 'paper_click', {
      paper_title: title.textContent.trim().slice(0, 100),
      link_type: link.textContent.trim(),
      transport_type: 'beacon'
    });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || document.visibilityState !== 'visible') return;
        window.gtag('event', 'section_view', { section_name: entry.target.closest('section').id });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('main section[id] .section-heading').forEach(function (heading) {
      observer.observe(heading);
    });
  }
})();
