(function () {
  var SIZE           = 22;
  var PRESSED        = 0.55;
  var COLOR_ON_DARK  = '#ffffff';
  var COLOR_ON_LIGHT = '#000000';

  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var style = document.createElement('style');
  style.textContent =
    'html.has-custom-cursor, html.has-custom-cursor * { cursor: none !important; }' +
    '.custom-cursor {' +
    '  position: fixed; left: 0; top: 0; z-index: 2147483647;' +
    '  width: ' + SIZE + 'px; height: ' + SIZE + 'px; border-radius: 50%;' +
    '  pointer-events: none; opacity: 0;' +
    '  transition: opacity .2s ease, background-color .2s ease;' +
    '  will-change: transform;' +
    '}' +
    '.custom-cursor.is-visible { opacity: 1; }' +
    '.custom-cursor__dot {' +
    '  width: 100%; height: 100%; border-radius: 50%; background: currentColor;' +
    '  transition: transform .15s ease;' +
    '}' +
    '.custom-cursor.is-pressed .custom-cursor__dot { transform: scale(' + PRESSED + '); }';
  document.head.appendChild(style);

  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  var dot = document.createElement('div');
  dot.className = 'custom-cursor__dot';
  cursor.appendChild(dot);

  function isLightPage() {
    var forced = document.body.getAttribute('data-cursor');
    if (forced === 'light') return true;
    if (forced === 'dark') return false;

    function bg(el) {
      var m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (!m) return null;
      var a = m.length > 3 ? parseFloat(m[3]) : 1;
      if (a === 0) return null;
      return [parseFloat(m[0]), parseFloat(m[1]), parseFloat(m[2])];
    }
    var c = bg(document.body) || bg(document.documentElement) || [255, 255, 255];
    var lum = (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
    return lum > 0.6;
  }

  function applyColor() {
    cursor.style.color = isLightPage() ? COLOR_ON_LIGHT : COLOR_ON_DARK;
  }

  function init() {
    document.body.appendChild(cursor);
    document.documentElement.classList.add('has-custom-cursor');
    applyColor();
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);

  var x = -100, y = -100, queued = false;

  function draw() {
    queued = false;
    cursor.style.transform = 'translate3d(' + (x - SIZE / 2) + 'px,' + (y - SIZE / 2) + 'px,0)';
  }

  document.addEventListener('mousemove', function (e) {
    x = e.clientX;
    y = e.clientY;
    cursor.classList.add('is-visible');
    if (!queued) { queued = true; requestAnimationFrame(draw); }
  }, { passive: true });

  document.addEventListener('mouseleave', function () { cursor.classList.remove('is-visible'); });
  document.addEventListener('mouseenter', function () { cursor.classList.add('is-visible'); });

  document.addEventListener('mousedown', function () { cursor.classList.add('is-pressed'); });
  document.addEventListener('mouseup',   function () { cursor.classList.remove('is-pressed'); });
  window.addEventListener('blur',        function () { cursor.classList.remove('is-pressed'); });
})();