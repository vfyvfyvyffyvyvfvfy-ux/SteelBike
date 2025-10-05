// Ensure the header always shows the brand title without greeting flicker
(function () {
  function setBrand() {
    // Use the globally available configuration
    const BRAND = window.APP_CONFIG?.telegramBotUsername || 'SteelBike'; // Fallback to default

    var header = document.querySelector('.app-header');
    if (!header) return;
    header.classList.add('header-centered');
    var h1 = header.querySelector('h1');
    if (h1) h1.textContent = BRAND;
    // Prevent any late scripts from replacing the title
    try {
      var target = h1 || header;
      var obs = new MutationObserver(function () {
        var h = document.querySelector('.app-header');
        if (!h) return;
        h.classList.add('header-centered');
        var t = h.querySelector('h1');
        if (t && t.textContent !== BRAND) t.textContent = BRAND;
      });
      obs.observe(target, { characterData: true, childList: true, subtree: true });
    } catch (_) {}

    document.documentElement.classList.add('brand-ready');
  }

  // The main.js script now controls initialization after config is loaded.
  // This script can be simplified or integrated into the new flow.
  // For now, we'll just ensure it runs after the config is expected to be there.
  // A more robust solution would be a custom event.
  if (document.readyState === 'complete') {
      setBrand();
  } else {
      window.addEventListener('load', setBrand);
  }
})();
