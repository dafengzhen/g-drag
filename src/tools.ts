export function findMatchingDropTarget(el: Element, selector: ((el: Element) => boolean) | string): Element | null {
  let current: Element | null = el;

  while (current && current !== document.body) {
    if (matchesSelector(current, selector)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

export function getEventClientPos(e: MouseEvent | PointerEvent | TouchEvent): [number, number] {
  const zoom = window.visualViewport?.scale || 1;

  if ('touches' in e && e.touches.length > 0) {
    const touch = e.touches[0];
    return [touch.clientX / zoom, touch.clientY / zoom];
  }

  if ('changedTouches' in e && e.changedTouches.length > 0) {
    const touch = e.changedTouches[0];
    return [touch.clientX / zoom, touch.clientY / zoom];
  }

  if ('clientX' in e && 'clientY' in e) {
    return [e.clientX / zoom, e.clientY / zoom];
  }

  return [0, 0];
}

export function matchesSelector(el: Element, selector: ((el: Element) => boolean) | string): boolean {
  return typeof selector === 'function' ? selector(el) : el.matches(selector);
}
