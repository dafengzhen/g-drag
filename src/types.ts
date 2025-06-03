export interface DragEvent {
  clientX: number;
  clientY: number;
  currentDropTarget?: Element | null;
  data?: Record<string, any>;
  deltaX: number;
  deltaY: number;
  offsetX: number;
  offsetY: number;
  originalEvent: MouseEvent | PointerEvent | TouchEvent;
  phase: DragPhase;
  proxy: HTMLElement;
  startX: number;
  startY: number;
  target: HTMLElement;
  totalDeltaX: number;
  totalDeltaY: number;
}

export interface DragOptions {
  data?: Record<string, any>;
  dragThreshold?: number;
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
  onDropAccepted?: (event: DragEvent) => void;
  onDropRejected?: (event: DragEvent) => void;
  onEnter?: (event: DragEvent) => void;
  onLeave?: (event: DragEvent) => void;
  onOver?: (event: DragEvent) => void;
  selector: ((el: Element) => boolean) | string;
  validateDrop?: (event: DragEvent) => boolean;
}
