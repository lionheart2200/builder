/* يدمج الإعدادات المحفوظة من المحرّر (localStorage) فوق config.js */
(() => {
  const K = "quizAdventureConfig", D = JSON.parse(JSON.stringify(window.GAME_CONFIG));
  const m = (a, b) => (Array.isArray(b) || !b || typeof b !== "object") ? b
    : Object.assign({}, a, Object.fromEntries(Object.entries(b).map(([k, v]) => [k, m(a && a[k], v)])));
  window.QA_DEFAULT = D;
  try { const s = JSON.parse(localStorage.getItem(K)); if (s) window.GAME_CONFIG = m(D, s); } catch (e) {}
  window.QA_save = c => { try { localStorage.setItem(K, JSON.stringify(c)); return true; } catch (e) { return false; } };
  window.QA_reset = () => { try { localStorage.removeItem(K); } catch (e) {} };
})();
