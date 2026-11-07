/* Einheitlicher Rueckweg aus allen vier Spielen zur Memory-Sammlung.
 * Ein eigener History-Eintrag sorgt dafuer, dass die Android-Zurueckgeste
 * zuerst zur Sammlung fuehrt, statt die installierte PWA zu beenden.
 * Vorhandene lokale Navigationsfunktionen bleiben unveraendert.
 */
(function () {
  'use strict';
  const here = location.pathname;
  const nested = /\/(?:wortmemory|synonymmemory|verrueckt-gesucht)\//.test(here);
  const home = new URL(nested ? '../index.html?menu=1' : 'index.html?menu=1', location.href);
  const guardKey = '__lesespieleCollectionEntry';
  if (location.pathname === home.pathname) return;
  let navigating = false;
  function goHome() {
    if (navigating) return;
    navigating = true;
    location.replace(home.href);
  }
  try {
    if (!history.state || !history.state[guardKey]) {
      history.pushState(Object.assign({}, history.state || {}, { [guardKey]: true }), '', location.href);
    }
  } catch (_) {}
  addEventListener('popstate', function (event) {
    // Interne History-Eintraege (insbesondere in Verrueckt gesucht) beibehalten.
    if (event.state && event.state[guardKey]) return;
    if (event.state && event.state.vgScreen && event.state.vgScreen !== 'setup') return;
    goHome();
  });
  function onSetup() {
    if (here.includes('/verrueckt-gesucht/')) return document.body.dataset.screen === 'setup';
    if (here.includes('/synonymmemory/')) return !document.getElementById('syn-setup')?.hidden;
    if (here.endsWith('/eigenschaften.html')) return !document.getElementById('start')?.hidden;
    const selection = document.getElementById('selection');
    return !selection || !selection.hidden;
  }
  // Nur eine eindeutige Geste direkt am linken Rand behandeln;
  // normales Wischen auf Karten oder vertikales Scrollen bleibt frei.
  let swipe = null;
  addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1 || !onSetup()) return;
    const t = event.touches[0];
    swipe = t.clientX <= 26 ? { x: t.clientX, y: t.clientY, at: Date.now() } : null;
  }, { passive: true });
  addEventListener('touchend', function (event) {
    if (!swipe || event.changedTouches.length !== 1) return;
    const t = event.changedTouches[0], dx = t.clientX - swipe.x, dy = t.clientY - swipe.y;
    const valid = dx > 115 && Math.abs(dy) < 65 && Date.now() - swipe.at < 900;
    swipe = null;
    if (valid && onSetup() && !document.querySelector('dialog[open]')) goHome();
  }, { passive: true });
  addEventListener('touchcancel', function () { swipe = null; }, { passive: true });

  // Expliziter, grosser Rueckweg fuer Touch und Tastatur.
  function addLink() {
    if (document.querySelector('a.collection-return')) return;
    for (const a of document.querySelectorAll('a[href]')) {
      try {
        if (new URL(a.href).pathname === home.pathname) return;
      } catch (_) {}
    }
    const a = document.createElement('a');
    a.className = 'collection-return';
    a.href = home.href;
    a.textContent = '← Alle Spiele';
    a.setAttribute('aria-label', 'Zur gesamten Memory-Spielauswahl');
    const header = document.querySelector('header');
    if (header) header.appendChild(a);
    else document.body.prepend(a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addLink, { once: true });
  else addLink();
})();
