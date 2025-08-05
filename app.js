/*
 * Client side logic for Pitstop.
 * Handles tab routing, theming, toasts and simple persistence.
 */

(function () {
  /**
   * Set up simple client‑side router. When a tab button is clicked, hide all
   * other sections and mark the clicked tab as active. Also update the
   * location hash so that the current section can be restored on refresh.
   */
  const tabButtons = document.querySelectorAll('.tab-button');
  const sections = document.querySelectorAll('.tab-content');

  function showTab(name) {
    sections.forEach((section) => {
      section.classList.toggle('active', section.id === name);
    });
    tabButtons.forEach((btn) => {
      const selected = btn.dataset.target === name;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-selected', selected);
    });
  }

  function updateHash(name) {
    // Use history API to prevent full page reload
    history.pushState(null, '', '#' + name);
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      showTab(target);
      updateHash(target);
    });
  });

  // Initialize tab based on hash or default to dashboard
  function initTabFromHash() {
    const hash = location.hash.replace('#', '');
    const initial = hash || 'dashboard';
    showTab(initial);
  }
  initTabFromHash();
  window.addEventListener('hashchange', initTabFromHash);

  /**
   * Theme handling. We store the user preference in localStorage as
   * `pitstop-theme`. If set to `auto`, we follow the system preference.
   */
  const rootEl = document.documentElement;
  const themeSelect = document.getElementById('theme-select');
  const quickToggle = document.getElementById('quick-theme-toggle');

  function prefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(pref, skipSave) {
    let mode = pref;
    if (pref === 'auto') {
      mode = prefersDark() ? 'dark' : 'light';
    }
    rootEl.setAttribute('data-theme', mode);
    // update the body class to allow auto fallback styles
    document.body.classList.toggle('dark-preferred', mode === 'dark');
    document.body.classList.toggle('light-preferred', mode === 'light');
    // update the select and quick toggle text
    if (!skipSave) {
      localStorage.setItem('pitstop-theme', pref);
    }
    themeSelect.value = pref;
    quickToggle.textContent = mode === 'dark' ? '🌙' : '☀️';
  }

  // Initialize theme from storage
  const savedTheme = localStorage.getItem('pitstop-theme') || 'auto';
  applyTheme(savedTheme, true);

  themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });

  quickToggle.addEventListener('click', () => {
    // Cycle through auto → dark → light → auto
    const current = localStorage.getItem('pitstop-theme') || 'auto';
    let next;
    if (current === 'auto') {
      next = 'dark';
    } else if (current === 'dark') {
      next = 'light';
    } else {
      next = 'auto';
    }
    applyTheme(next);
  });

  // Listen to system preference changes when in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const pref = localStorage.getItem('pitstop-theme') || 'auto';
    if (pref === 'auto') {
      applyTheme('auto', true);
    }
  });

  /**
   * Units selection. Persist the selected units in localStorage so users
   * don’t need to reselect on every visit.
   */
  const unitsSelect = document.getElementById('units-select');
  const savedUnits = localStorage.getItem('pitstop-units') || 'miles';
  unitsSelect.value = savedUnits;
  unitsSelect.addEventListener('change', () => {
    localStorage.setItem('pitstop-units', unitsSelect.value);
  });

  /**
   * Toast utility. Creates a toast message that fades in and out.
   */
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    // Allow CSS transitions to kick in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener(
        'transitionend',
        () => {
          toast.remove();
        },
        { once: true }
      );
    }, duration);
  }

  // Attach click handlers to asset cards to demonstrate the toast
  document.querySelectorAll('.asset-card').forEach((card) => {
    const handler = () => showToast('Detail coming soon.');
    card.addEventListener('click', handler);
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });

  /**
   * Register the service worker if supported. The service worker caches
   * core assets for offline use. It does nothing if the browser
   * doesn’t support service workers.
   */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .catch((err) => {
        console.error('Service worker registration failed', err);
      });
  }
})();