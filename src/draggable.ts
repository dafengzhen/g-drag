import type { DragEvent, DragOptions, DragPhase } from './types';

import { findMatchingDropTarget, getEventClientPos } from './tools';

export class Draggable {
  private currentDropTarget: Element | null = null;

  private readonly dragThreshold: number;

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

  private totalDeltaX = 0;

  private totalDeltaY = 0;

  constructor(target: HTMLElement, options: DragOptions) {
    this.target = target;
    this.options = options;
    this.proxy = target.cloneNode(true) as HTMLElement;
    this.dragThreshold = options.dragThreshold ?? 5;

    if (window.PointerEvent) {
      this.target.addEventListener('pointerdown', this.onStart);
    } else {
      this.target.addEventListener('mousedown', this.onStart);
      this.target.addEventListener('touchstart', this.onStart, { passive: false });
    }
  }

  destroy(): void {
    this.removeEventListeners();
    this.target.removeEventListener('mousedown', this.onStart);
    this.target.removeEventListener('touchstart', this.onStart);
    this.target.removeEventListener('pointerdown', this.onStart);
    this.destroyProxy();
  }

  destroyProxy() {
    if (this.proxy && this.proxy.parentNode) {
      this.proxy.parentNode.removeChild(this.proxy);
    }
  }

  private addEventListeners(): void {
    const passiveOption = { passive: false };

    if (window.PointerEvent) {
      document.addEventListener('pointermove', this.onMove, passiveOption);
      document.addEventListener('pointerup', this.onEnd);
      document.addEventListener('pointercancel', this.onEnd);
    } else {
      document.addEventListener('mousemove', this.onMove);
      document.addEventListener('mouseup', this.onEnd);
      document.addEventListener('touchmove', this.onMove, passiveOption);
      document.addEventListener('touchend', this.onEnd);
      document.addEventListener('touchcancel', this.onEnd);
    }
  }

  private dispatch = (
    phase: DragPhase,
    originalEvent: MouseEvent | PointerEvent | TouchEvent,
    dx = 0,
    dy = 0,
  ): DragEvent => {
    const [clientX, clientY] = getEventClientPos(originalEvent);

    return {
      clientX,
      clientY,
      currentDropTarget: this.currentDropTarget,
      data: this.options.data,
      deltaX: dx,
      deltaY: dy,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      originalEvent,
      phase,
      proxy: this.proxy,
      startX: this.startX,
      startY: this.startY,
      target: this.target,
      totalDeltaX: this.totalDeltaX,
      totalDeltaY: this.totalDeltaY,
    };
  };

  private onEnd = (e: MouseEvent | PointerEvent | TouchEvent): void => {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    this.removeEventListeners();

    const endEvent = this.dispatch('end', e);
    this.options.onDragEnd?.(endEvent);

    if (this.currentDropTarget && this.options.dropTargets) {
      const isValid = this.options.dropTargets.validateDrop?.(endEvent) ?? true;

      if (isValid) {
        this.options.dropTargets.onDrop?.(endEvent);
        this.options.dropTargets.onDropAccepted?.(endEvent);
      } else {
        this.options.dropTargets.onDropRejected?.(endEvent);
      }
    }

    this.destroyProxy();
  };

  private onMove = (e: MouseEvent | PointerEvent | TouchEvent): void => {
    if (!this.isDragging) {
      return;
    }

    const [clientX, clientY] = getEventClientPos(e);
    const dx = clientX - this.lastX;
    const dy = clientY - this.lastY;

    this.totalDeltaX = clientX - this.startX;
    this.totalDeltaY = clientY - this.startY;

    if (!this.hasMovedBeyondThreshold) {
      if (Math.hypot(dx, dy) < this.dragThreshold) {
        return;
      }
      this.hasMovedBeyondThreshold = true;
    }

    this.lastX = clientX;
    this.lastY = clientY;

    this.options.updatePosition?.(this.proxy, dx, dy);

    const moveEvent = this.dispatch('move', e, dx, dy);
    this.options.onDragMove?.(moveEvent);

    const { dropTargets } = this.options;
    if (dropTargets) {
      const el = document.elementFromPoint(clientX, clientY) || document.body;
      if (el && !this.proxy.contains(el)) {
        const matched = el ? findMatchingDropTarget(el, dropTargets.selector) : null;

        if (matched !== this.currentDropTarget) {
          if (this.currentDropTarget) {
            dropTargets.onLeave?.(moveEvent);
          }
          if (matched) {
            dropTargets.onEnter?.(moveEvent);
          }
          this.currentDropTarget = matched;
        }

        if (matched && dropTargets.onOver) {
          dropTargets.onOver(moveEvent);
        }
      }
    }

    e.preventDefault();
  };

  private onStart = (e: MouseEvent | PointerEvent | TouchEvent): void => {
    const [clientX, clientY] = getEventClientPos(e);
    this.startX = this.lastX = clientX;
    this.startY = this.lastY = clientY;
    this.totalDeltaX = 0;
    this.totalDeltaY = 0;

    const rect = this.target.getBoundingClientRect();
    this.offsetX = clientX - rect.left;
    this.offsetY = clientY - rect.top;

    const dragStartEvent = this.dispatch('start', e);
    if (this.options.onDragStart?.(dragStartEvent) === false) {
      return;
    }

    this.isDragging = true;
    this.hasMovedBeyondThreshold = false;
    this.currentDropTarget = null;

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
    if (window.PointerEvent) {
      document.removeEventListener('pointermove', this.onMove);
      document.removeEventListener('pointerup', this.onEnd);
      document.removeEventListener('pointercancel', this.onEnd);
    } else {
      document.removeEventListener('mousemove', this.onMove);
      document.removeEventListener('mouseup', this.onEnd);
      document.removeEventListener('touchmove', this.onMove);
      document.removeEventListener('touchend', this.onEnd);
      document.removeEventListener('touchcancel', this.onEnd);
    }
  }
}
