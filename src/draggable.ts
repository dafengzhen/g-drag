import type { DragEvent, DragOptions, DragPhase } from './types';

import { findMatchingDropTarget, getEventClientPos } from './tools';

export class Draggable {
  private currentDropTarget: Element | null = null;

  private dragThreshold = 5;

  private hasMovedBeyondThreshold = false;

  private isDragging = false;

  private lastX = 0;

  private lastY = 0;

  private offsetX = 0;

  private offsetY = 0;

  private readonly options: DragOptions;

  private readonly proxy: HTMLElement;

  private startX = 0;

  private startY = 0;

  private readonly target: HTMLElement;

  constructor(target: HTMLElement, options: DragOptions) {
    this.target = target;
    this.options = options;
    this.proxy = target.cloneNode(true) as HTMLElement;

    this.target.addEventListener('mousedown', this.onStart);
    this.target.addEventListener('touchstart', this.onStart, { passive: false });
    this.target.addEventListener('pointerdown', this.onStart);
  }

  destroy(): void {
    this.removeEventListeners();
    this.target.removeEventListener('mousedown', this.onStart);
    this.target.removeEventListener('touchstart', this.onStart);
    this.target.removeEventListener('pointerdown', this.onStart);
  }

  private addEventListeners(): void {
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
    document.addEventListener('touchmove', this.onMove, { passive: false });
    document.addEventListener('touchend', this.onEnd);
    document.addEventListener('pointermove', this.onMove);
    document.addEventListener('pointerup', this.onEnd);
  }

  private dispatch = (phase: DragPhase, originalEvent: MouseEvent | PointerEvent | TouchEvent): DragEvent => ({
    data: this.options.data,
    originalEvent,
    phase,
    proxy: this.proxy,
    target: this.target,
  });

  private onEnd = (e: MouseEvent | PointerEvent | TouchEvent): void => {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    this.removeEventListeners();

    this.options.onDragEnd?.(this.dispatch('end', e));

    if (this.currentDropTarget && this.options.dropTargets?.onDrop) {
      this.options.dropTargets.onDrop(this.dispatch('end', e));
    }

    this.proxy.remove();
  };

  private onMove = (e: MouseEvent | PointerEvent | TouchEvent): void => {
    if (!this.isDragging) {
      return;
    }

    const [clientX, clientY] = getEventClientPos(e);
    const dx = clientX - this.lastX;
    const dy = clientY - this.lastY;

    if (!this.hasMovedBeyondThreshold) {
      if (Math.hypot(dx, dy) < this.dragThreshold) {
        return;
      }
      this.hasMovedBeyondThreshold = true;
    }

    this.lastX = clientX;
    this.lastY = clientY;

    this.options.updatePosition?.(this.proxy, dx, dy);
    this.options.onDragMove?.(this.dispatch('move', e));

    const { dropTargets } = this.options;
    if (dropTargets) {
      const el = document.elementFromPoint(clientX, clientY);
      if (el && !this.proxy.contains(el)) {
        const matched = el ? findMatchingDropTarget(el, dropTargets.selector) : null;

        if (matched !== this.currentDropTarget) {
          if (this.currentDropTarget) {
            dropTargets.onLeave?.(this.dispatch('move', e));
          }
          if (matched) {
            dropTargets.onEnter?.(this.dispatch('move', e));
          }
          this.currentDropTarget = matched;
        }
      }
    }

    e.preventDefault();
  };

  private onStart = (e: MouseEvent | PointerEvent | TouchEvent): void => {
    const [clientX, clientY] = getEventClientPos(e);
    this.startX = this.lastX = clientX;
    this.startY = this.lastY = clientY;

    const rect = this.target.getBoundingClientRect();
    this.offsetX = clientX - rect.left;
    this.offsetY = clientY - rect.top;

    const dragStartEvent = this.dispatch('start', e);
    if (this.options.onDragStart?.(dragStartEvent) === false) {
      return;
    }

    this.isDragging = true;

    if (this.options.setupProxy) {
      this.options.setupProxy(this.proxy, dragStartEvent);
    } else {
      Object.assign(this.proxy.style, {
        left: `${this.startX - this.offsetX}px`,
        pointerEvents: 'none',
        position: 'absolute',
        top: `${this.startY - this.offsetY}px`,
        zIndex: '9999',
      });
      document.body.appendChild(this.proxy);
    }

    this.addEventListeners();
    e.preventDefault();
  };

  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseup', this.onEnd);
    document.removeEventListener('touchmove', this.onMove);
    document.removeEventListener('touchend', this.onEnd);
    document.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerup', this.onEnd);
  }
}
