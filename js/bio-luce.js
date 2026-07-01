/* ============================================================
   BIO — CORDICINA & LAMPADINA
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const room = document.getElementById('bio-dark-room');
  const pull = document.getElementById('bio-cord-pull');
  const pendulum = document.getElementById('bio-cord-pendulum');
  const cordString = document.querySelector('.bio-cord-string');
  if (!room || !pull || !pendulum || !cordString) return;

  const PULL_MAX = 160;
  const BASE_CORD = 110;
  const TRIGGER = 115;
  const GRAVITY = 0.0022;
  const DAMPING = 0.992;
  const MAX_ANGLE = 0.62;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let pullDistance = 0;
  let angle = 0.1;
  let angularVelocity = 0.002;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let lastPointerTime = 0;
  let velX = 0;
  let retracting = false;
  let rafId = null;

  function setProgress(progress) {
    const p = Math.min(1, Math.max(0, progress));
    room.style.setProperty('--pull-progress', p.toFixed(2));
    room.classList.toggle('is-pulling', p > 0.05);
  }

  function applyTransform() {
    const deg = angle * (180 / Math.PI);
    pendulum.style.transform = `rotate(${deg}deg)`;
  }

  function updateCord(distance) {
    pullDistance = Math.min(PULL_MAX, Math.max(0, distance));
    cordString.style.height = `${BASE_CORD + pullDistance}px`;
    setProgress(pullDistance / TRIGGER);
  }

  function resetCord() {
    if (room.classList.contains('is-on')) return;
    pullDistance = 0;
    retracting = false;
    cordString.style.height = `${BASE_CORD}px`;
    setProgress(0);
    room.classList.remove('is-pulling');
  }

  function turnOn() {
    document.body.classList.add('bio-lit');
    room.classList.add('is-on');
    room.setAttribute('aria-hidden', 'true');
    setProgress(1);
    resetCord();
    if (rafId) cancelAnimationFrame(rafId);
  }

  function physicsStep() {
    if (room.classList.contains('is-on')) return;

    if (!dragging && !reducedMotion) {
      if (retracting && pullDistance > 0) {
        pullDistance = Math.max(0, pullDistance - pullDistance * 0.065);
        if (pullDistance < 0.5) pullDistance = 0;
        cordString.style.height = `${BASE_CORD + pullDistance}px`;
        setProgress(pullDistance / TRIGGER);
        if (pullDistance === 0) {
          retracting = false;
          room.classList.remove('is-pulling');
        }
      }

      const angularAccel = -GRAVITY * Math.sin(angle);
      angularVelocity += angularAccel;
      angularVelocity *= DAMPING;

      if (!retracting && pullDistance === 0 && Math.abs(angularVelocity) < 0.0004) {
        angularVelocity += 0.0012 * Math.sin(Date.now() / 900);
      }

      angle += angularVelocity;

      if (Math.abs(angle) > MAX_ANGLE) {
        angle = Math.sign(angle) * MAX_ANGLE;
        angularVelocity *= -0.4;
      }
    }

    applyTransform();
    rafId = requestAnimationFrame(physicsStep);
  }

  function onPointerDown(e) {
    if (room.classList.contains('is-on')) return;
    dragging = true;
    retracting = false;
    startX = e.clientX;
    startY = e.clientY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    lastPointerTime = performance.now();
    velX = 0;
    angularVelocity = 0;
    pull.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTime);
    velX = (e.clientX - lastPointerX) / dt;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    lastPointerTime = now;

    const deltaY = e.clientY - startY;
    updateCord(deltaY);

    const horizontalDelta = (e.clientX - startX) * 0.005;
    angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, horizontalDelta));

    e.preventDefault();
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    if (pull.hasPointerCapture(e.pointerId)) {
      pull.releasePointerCapture(e.pointerId);
    }

    if (pullDistance >= TRIGGER) {
      turnOn();
      return;
    }

    if (reducedMotion) {
      resetCord();
      return;
    }

    angularVelocity += velX * 0.018;
    angularVelocity += angle * 0.2;
    angularVelocity += (pullDistance / TRIGGER) * 0.09;
    retracting = true;
  }

  pull.addEventListener('pointerdown', onPointerDown);
  pull.addEventListener('pointermove', onPointerMove);
  pull.addEventListener('pointerup', onPointerUp);
  pull.addEventListener('pointercancel', onPointerUp);

  cordString.style.height = `${BASE_CORD}px`;
  applyTransform();
  physicsStep();
});
