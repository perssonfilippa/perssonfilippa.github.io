// Svartvitt-läge: knapp nere till vänster, valet sparas mellan sidorna.
// Läggs i <head> (utan defer) så att rätt läge sätts direkt och sidan inte blinkar.
(function () {
    var KEY = 'bw-mode';
    var root = document.documentElement;
    var btn = null, meta = null, origColor = null;
  
    function stored() {
      try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
    }
    function save(on) {
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    }
  
    function apply(on) {
      root.classList.toggle('bw', on);
      if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (meta) meta.setAttribute('content', on ? '#000000' : origColor);
    }
  
    // Direkt, innan sidan målas
    apply(stored());
  
    document.addEventListener('DOMContentLoaded', function () {
      meta = document.querySelector('meta[name="theme-color"]');
      origColor = meta ? meta.getAttribute('content') : null;
  
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bw-toggle';
      btn.setAttribute('aria-label', 'Växla svartvitt läge');
      btn.setAttribute('title', 'Black & white');
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
        '<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>' +
        '</svg>';
  
      btn.addEventListener('click', function () {
        var on = !root.classList.contains('bw');
        apply(on);
        save(on);
      });
  
      document.body.appendChild(btn);
      apply(root.classList.contains('bw'));
    });
  })();