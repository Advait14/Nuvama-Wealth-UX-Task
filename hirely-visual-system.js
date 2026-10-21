/*
 * Hire-ly Visual System runtime enhancements.
 * This module only decorates existing, functional markup. It does not own
 * candidate data or navigation state, so the current product behaviour stays
 * intact while the page gains reusable classes and accessible affordances.
 */
(function initHirelyVisualSystem() {
  'use strict';

  const apply = () => {
    const root = document.documentElement;

    root.style.setProperty('--hy-page-gutter', '32px');

    document.querySelectorAll('#view-analytics > .grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4').forEach((grid) => {
      grid.classList.add('hy-kpi-grid');
      grid.querySelectorAll(':scope > div').forEach((card) => card.classList.add('hy-card', 'hy-stack'));
    });

    document.querySelectorAll('#view-analytics > .grid.grid-cols-1.lg\\:grid-cols-3 > div').forEach((widget) => {
      widget.classList.add('hy-widget', 'hy-stack', 'hy-widget--medium');
    });

    const analyticsTable = document.querySelector('#view-analytics > .bg-surface.border');
    if (analyticsTable) analyticsTable.classList.add('hy-card--spacious');

    document.querySelectorAll('.candidate-card').forEach((card) => {
      card.classList.add('hy-candidate-card');
      const title = card.querySelector('h3');
      if (title && !title.title) title.title = title.textContent.trim();
    });

    document.querySelector('.context-filter-panel')?.classList.add('hy-filter-panel');
    const drawer = document.querySelector('#quickDrawer');
    drawer?.classList.add('hy-drawer');
    if (drawer) drawer.setAttribute('aria-hidden', drawer.classList.contains('drawer-open') ? 'false' : 'true');
    document.querySelector('#drawerOverlay')?.setAttribute('aria-hidden', 'true');

    document.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => {
        image.hidden = true;
        image.parentElement?.classList.add('hy-image-fallback');
      }, { once: true });
    });

    document.querySelectorAll('[data-tooltip]').forEach((element) => {
      if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', element.getAttribute('data-tooltip'));
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }

  // Candidate cards are rendered after filtering, so keep their visual
  // contract in place whenever the queue refreshes.
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) apply();
  });

  const queue = document.querySelector('#candidatesGrid, #candidateGrid, .candidate-grid, #view-screening');
  if (queue) observer.observe(queue, { childList: true, subtree: true });

  const drawer = document.querySelector('#quickDrawer');
  if (drawer) {
    new MutationObserver(() => {
      drawer.setAttribute('aria-hidden', drawer.classList.contains('drawer-open') ? 'false' : 'true');
    }).observe(drawer, { attributes: true, attributeFilter: ['class'] });
  }
})();
