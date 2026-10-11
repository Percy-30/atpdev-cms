(function () {
  try {
    var doc = document.documentElement;
    var serverTheme = doc.getAttribute('data-server-theme') || (doc.classList.contains('dark') ? 'dark' : (doc.classList.contains('light') ? 'light' : null));
    var storedTheme = localStorage.getItem('sorteos_theme');
    var lastServerTheme = localStorage.getItem('sorteos_server_theme');

    var effectiveTheme = 'dark'; // default to official dark theme

    if (serverTheme) {
      if (!storedTheme || lastServerTheme !== serverTheme) {
        effectiveTheme = serverTheme;
        try {
          localStorage.setItem('sorteos_theme', serverTheme);
          localStorage.setItem('sorteos_server_theme', serverTheme);
        } catch (e) {}
      } else {
        effectiveTheme = storedTheme;
      }
    } else if (storedTheme) {
      effectiveTheme = storedTheme;
    }

    if (effectiveTheme === 'dark') {
      doc.classList.add('dark');
      doc.classList.remove('light');
    } else {
      doc.classList.add('light');
      doc.classList.remove('dark');
    }

    // Auto-detect browser language if not previously set by user
    var supported = ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'hi', 'ar'];
    var lang = localStorage.getItem('sorteos_lang');
    if (!lang && typeof navigator !== 'undefined') {
      var browserLangs = navigator.languages || [navigator.language];
      for (var i = 0; i < browserLangs.length; i++) {
        var raw = browserLangs[i];
        if (!raw) continue;
        var code = raw.split('-')[0].toLowerCase();
        if (supported.indexOf(code) !== -1) {
          lang = code;
          try {
            localStorage.setItem('sorteos_lang', code);
            document.cookie = 'sorteos_lang=' + code + '; path=/; max-age=31536000; SameSite=Lax';
          } catch (e) {}
          break;
        }
      }
    }
    if (lang) {
      doc.lang = lang;
      if (lang === 'ar') doc.dir = 'rtl';
    }
  } catch (e) {}
})();
