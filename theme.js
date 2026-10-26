// Svartvitt-läge: knapp nere till vänster, valet sparas mellan sidorna.
// Läggs i <head> (utan defer) så att rätt läge sätts direkt och sidan inte blinkar.
(function () {
    var KEY = 'bw-mode';
    var root = document.documentElement;
    var btn = null, meta = null, origColor = null;
  
    // Sidans två färger. Allt som har exakt någon av dem (text, bakgrund eller ram)
    // blir svart respektive vitt i svartvitt-läget, även när färgen är hårdkodad
    // och alltså inte går via en variabel.
    var GREEN = 'rgb(148, 145, 57)';    // #949139
    var BEIGE = 'rgb(236, 237, 233)';   // #ECEDE9
    var PROPS = [['color', 'c'], ['backgroundColor', 'b'], ['borderTopColor', 'o']];
  
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
  
    // Märker element vars färger är grönt eller beige, mätt i vanligt läge.
    // theme.css har reglerna som gör märkta element svarta/vita.
    function mark() {
      var list = [root, document.body].concat(
        Array.prototype.slice.call(document.body.querySelectorAll('*'))
      );
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        var cs = getComputedStyle(el);
        var tokens = [];
        for (var j = 0; j < PROPS.length; j++) {
          var v = cs[PROPS[j][0]];
          if (v === GREEN) tokens.push(PROPS[j][1] + '-g');
          else if (v === BEIGE) tokens.push(PROPS[j][1] + '-b');
        }
        if (tokens.length) el.setAttribute('data-bw', tokens.join(' '));
        else el.removeAttribute('data-bw');
      }
    }
  
    function remark() {
      var was = root.classList.contains('bw');
      root.classList.add('bw-calc');           // stänger av övergångar en stund
      if (was) root.classList.remove('bw');    // mät utan svartvitt-läget
      mark();
      if (was) root.classList.add('bw');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { root.classList.remove('bw-calc'); });
      });
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
      remark();
    });
  
    // När stilar och bilder är helt laddade, mät en gång till
    window.addEventListener('load', remark);
  })();