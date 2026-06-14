document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('galleryContainer');
  if (!container) return;

  var squares = container.querySelectorAll('.gallery-square');
  var count = squares.length;
  var radius = 200;
  var squareSize = 300;

  // ---- Cubic bezier helper (0.42, 0, 0.58, 1) ----
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // ---- State ----
  var offset = 0;
  var isPlaying = false;
  var animStartTime = 0;
  var animDuration = 7;
  var pauseDuration = 1;
  var isPausing = false;
  var pauseStartTime = 0;

  // ---- Entrance state ----
  var entered = new Array(count).fill(false);
  var entranceStartTimes = new Array(count).fill(0);

  // ---- Positioning ----
  function getAngle(index, off) {
    return ((index / count + off) % 1) * Math.PI * 2;
  }

  function setSquarePosition(i, off, scale) {
    var angle = getAngle(i, off);
    var x = Math.cos(angle) * radius;
    var y = Math.sin(angle) * radius;
    squares[i].style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
  }

  // ---- Entrance animation ----
  function animateEntrance(idx) {
    entranceStartTimes[idx] = performance.now();
    entered[idx] = true;

    function step() {
      var elapsed = (performance.now() - entranceStartTimes[idx]) / 1000;
      var progress = Math.min(elapsed / 1, 1);
      var eased = 1 - Math.pow(1 - progress, 2);
      var scale = 0.9 + eased * 0.1;
      var opacity = eased;
      squares[idx].style.opacity = opacity;
      setSquarePosition(idx, 0, scale);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ---- Cycle animation loop ----
  function tick() {
    if (!isPlaying) return;

    var now = performance.now();

    if (isPausing) {
      var pauseElapsed = (now - pauseStartTime) / 1000;
      if (pauseElapsed >= pauseDuration) {
        isPausing = false;
        animStartTime = now;
      }
    } else {
      var elapsed = (now - animStartTime) / 1000;
      var rawProgress = Math.min(elapsed / animDuration, 1);
      var easedProgress = easeInOut(rawProgress);

      if (rawProgress >= 1) {
        offset = Math.floor(offset) + 1;
        isPausing = true;
        pauseStartTime = now;
      } else {
        offset = Math.floor(offset) + easedProgress;
      }
    }

    for (var i = 0; i < count; i++) {
      if (!entered[i]) continue;
      setSquarePosition(i, offset, 1);
    }

    updateClone();

    requestAnimationFrame(tick);
  }

  // ---- Seamless loop ----
  var cloneDiv = null;

  function setupClone() {
    var lastSquare = squares[count - 1];
    var firstImg = squares[0].querySelector('img');
    if (!firstImg) return;

    cloneDiv = document.createElement('div');
    cloneDiv.style.cssText = 'position:absolute;inset:0;border-radius:16px;overflow:clip;';
    var cloneImg = firstImg.cloneNode(true);
    cloneImg.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    cloneDiv.appendChild(cloneImg);
    lastSquare.appendChild(cloneDiv);
  }

  function updateClone() {
    if (!cloneDiv) return;

    var firstAngle = getAngle(0, offset);
    var lastAngle = getAngle(count - 1, offset);
    var dx = Math.cos(firstAngle) * radius - Math.cos(lastAngle) * radius;
    var dy = Math.sin(firstAngle) * radius - Math.sin(lastAngle) * radius;

    cloneDiv.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
  }

  // ---- Init ----
  for (var i = 0; i < count; i++) {
    squares[i].style.willChange = 'transform';
    squares[i].style.opacity = '0';
    setSquarePosition(i, 0, 0.9);
  }

  setupClone();

  for (var i = 0; i < count; i++) {
    (function (idx) {
      var delay = idx * 120 + 350;
      setTimeout(function () {
        setSquarePosition(idx, 0, 0.9);
        animateEntrance(idx);
      }, delay);
    })(i);
  }

  setTimeout(function () {
    isPlaying = true;
    animStartTime = performance.now();
    tick();
  }, count * 120 + 350 + 100);
});
