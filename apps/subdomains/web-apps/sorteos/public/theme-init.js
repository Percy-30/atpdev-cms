(function () {
  try {
    var theme = localStorage.getItem('sorteos_theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
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
      document.documentElement.lang = lang;
      if (lang === 'ar') document.documentElement.dir = 'rtl';
    }
  } catch (e) {}
})();
