export interface DragEvent {
  data?: Record<string, any>;
  originalEvent: MouseEvent | PointerEvent | TouchEvent;
  phase: DragPhase;
  proxy: HTMLElement;
  target: HTMLElement;
}

export interface DragOptions {
  data?: Record<string, any>;
  dropTargets?: DropTargets;
  onDragEnd?: (event: DragEvent) => void;
  onDragMove?: (event: DragEvent) => void;
  onDragStart?: (event: DragEvent) => boolean | void;
  setupProxy?: (proxy: HTMLElement, event: DragEvent) => void;
  updatePosition?: (el: HTMLElement, dx: number, dy: number) => void;
}

export type DragPhase = 'end' | 'move' | 'start';

export interface DropTargets {
  onDrop?: (event: DragEvent) => void;
  onEnter?: (event: DragEvent) => void;
  onLeave?: (event: DragEvent) => void;
  selector: ((el: Element) => boolean) | string;
}
