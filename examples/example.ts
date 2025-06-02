import { Draggable } from '../src/draggable';

const draggable = document.getElementById('draggable');
const dropzone = document.querySelector('.dropzone');

if (draggable && dropzone) {
  new Draggable(draggable, {
    data: { id: 'block-1' },
    dropTargets: {
      onDrop: () => {
        console.log('Dropped');
        dropzone.classList.remove('active');
      },
      onEnter: () => {
        console.log('Entered drop zone');
        dropzone.classList.add('active');
      },
      onLeave: () => {
        console.log('Left drop zone');
        dropzone.classList.remove('active');
      },
      selector: '.dropzone',
    },
    onDragEnd: (e) => {
      console.log('Drag ended', e);
      const targetEl = e.target as HTMLElement;
      const proxyRect = e.proxy.getBoundingClientRect();

      targetEl.style.left = `${proxyRect.left}px`;
      targetEl.style.top = `${proxyRect.top}px`;
    },
    onDragMove: (e) => {
      console.log('Dragging', e);
    },
    onDragStart: (e) => {
      console.log('Drag started', e);
    },
    updatePosition: (el, dx, dy) => {
      const rect = el.getBoundingClientRect();
      el.style.left = `${rect.left + dx}px`;
      el.style.top = `${rect.top + dy}px`;
    },
  });
} else {
  console.error('Draggable element or dropzone not found');
}
