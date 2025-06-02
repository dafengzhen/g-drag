# g-drag

[![GitHub License](https://img.shields.io/github/license/dafengzhen/g-drag?color=blue)](https://github.com/dafengzhen/g-drag)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dafengzhen/g-drag/pulls)

**g-drag** is a simple JavaScript drag-and-drop library.

[简体中文](./README.zh.md)

## Installation

```bash
npm install g-drag
```

## Quick Example

### Browser Compatibility

g-drag provides a legacy build for older browsers.

If your project needs to support legacy browsers, use the following import:

```ts
import {Draggable} from 'g-drag/legacy';
```

### Basic Usage

```ts
import {Draggable} from 'g-drag';

const draggable = document.getElementById('draggable');
const dropzone = document.querySelector('.dropzone');

new Draggable(draggable, {
  data: {id: 'block-1'},
  dropTargets: {
    onDrop: () => {
      console.log('Dropped');
      dropzone.classList.remove('active');
    },
    onEnter: () => {
      console.log('Entered dropzone');
      dropzone.classList.add('active');
    },
    onLeave: () => {
      console.log('Left dropzone');
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
```

## API Reference

### Draggable(target: HTMLElement, options: DragOptions)

Creates a draggable instance:

- target: The HTML element to make draggable
- options: Configuration options

| Option         | Type                                              | Description                         |
|----------------|---------------------------------------------------|-------------------------------------|
| data           | Record\<string, any>                              | Custom data passed with drag events |
| dropTargets    | DropTargets                                       | Drop target configuration           |
| onDragStart    | (event: DragEvent) => boolean                     | Triggered at drag start             |
| onDragMove     | (event: DragEvent) => void                        | Triggered during dragging           |
| onDragEnd      | (event: DragEvent) => void                        | Triggered at drag end               |
| setupProxy     | (proxy: HTMLElement, event: DragEvent) => void    | Customize the drag proxy element    |
| updatePosition | (el: HTMLElement, dx: number, dy: number) => void | Custom logic for updating position  |

### DropTargets

| Option   | Type                                 | Description                         |
|----------|--------------------------------------|-------------------------------------|
| selector | ((el: Element) => boolean) \| string | Drop target selector                |
| onEnter  | (event: DragEvent) => void           | Triggered when entering drop target |
| onLeave  | (event: DragEvent) => void           | Triggered when leaving drop target  |
| onDrop   | (event: DragEvent) => void           | Triggered when dropped on a target  |

### DragEvent

| Property      | Type                                     | Description              |
|---------------|------------------------------------------|--------------------------|
| data          | Record\<string, any>                     | Custom data              |
| originalEvent | MouseEvent \| PointerEvent \| TouchEvent | Original event object    |
| phase         | 'start' \| 'move' \| 'end'               | Drag phase               |
| proxy         | HTMLElement                              | Proxy element            |
| target        | HTMLElement                              | Original dragged element |

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

[MIT](https://opensource.org/licenses/MIT)

