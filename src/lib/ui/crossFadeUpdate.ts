/**
 * Cross-fades a container's content when it changes (e.g. switching
 * rite/gender/occasion), instead of swapping it instantly. Skips the fade on
 * the first render (no prior content to fade out) and respects
 * prefers-reduced-motion by updating immediately with no animation.
 *
 * Expects the container to already declare `transition: opacity ...` and an
 * `.is-updating { opacity: 0; }` rule in its own stylesheet.
 *
 * Interruptible by design: a call that lands while a previous fade is still
 * in flight finishes that one immediately rather than stacking a second
 * listener that would never resolve. A short timeout also backstops a
 * `transitionend` that never fires at all (backgrounded/throttled tab,
 * `transition` disabled by a stylesheet change, etc.) - the content must
 * never get stuck invisible.
 */
const FADE_TIMEOUT_MS = 220;

export function crossFadeUpdate(container: HTMLElement, render: () => void): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !container.hasChildNodes()) {
    render();
    return;
  }

  if (container.classList.contains('is-updating')) {
    // A fade was already in flight; resolve it now instead of leaving its
    // listener/timeout to fire later on top of the new one.
    render();
    container.classList.remove('is-updating');
  }

  container.classList.add('is-updating');

  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    container.removeEventListener('transitionend', onTransitionEnd);
    clearTimeout(timeoutId);
    render();
    // Deliberately synchronous, not requestAnimationFrame: rAF is paused for
    // backgrounded/inactive tabs, and this function's whole job is to never
    // leave the container stuck invisible. Removing the class in the same
    // task as render() just means the fade-in reads as an instant swap
    // rather than a soft crossfade - the fade-out before it still plays.
    container.classList.remove('is-updating');
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target === container && event.propertyName === 'opacity') finish();
  };

  container.addEventListener('transitionend', onTransitionEnd);
  const timeoutId = setTimeout(finish, FADE_TIMEOUT_MS);
}
