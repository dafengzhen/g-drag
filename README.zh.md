# g-drag

[![GitHub License](https://img.shields.io/github/license/dafengzhen/g-drag?color=blue)](https://github.com/dafengzhen/evflow)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dafengzhen/g-drag/pulls)

**g-drag** 是一个简单的 JavaScript 拖拽库

[English](./README.md)

## 安装

```bash
npm install g-drag
```

## 快速示例

### 浏览器兼容性

g-drag 提供了对旧浏览器的兼容版本（legacy build）

如果你的项目需要支持旧版浏览器，请使用以下方式引入：

```ts
import {Draggable} from 'g-drag/legacy';
```

### 基本用法

```ts
import {Draggable} from 'g-drag';

const draggable = document.getElementById('draggable');
const dropzone = document.querySelector('.dropzone');

new Draggable(draggable, {
  data: {id: 'block-1'},
  dropTargets: {
    onDrop: () => {
      console.log('已放置');
      dropzone.classList.remove('active');
    },
    onEnter: () => {
      console.log('进入拖放区域');
      dropzone.classList.add('active');
    },
    onLeave: () => {
      console.log('离开拖放区域');
      dropzone.classList.remove('active');
    },
    selector: '.dropzone',
  },
  onDragEnd: (e) => {
    console.log('拖拽结束', e);
    const targetEl = e.target as HTMLElement;
    const proxyRect = e.proxy.getBoundingClientRect();

    targetEl.style.left = `${proxyRect.left}px`;
    targetEl.style.top = `${proxyRect.top}px`;
  },
  onDragMove: (e) => {
    console.log('正在拖动', e);
  },
  onDragStart: (e) => {
    console.log('开始拖动', e);
  },
  updatePosition: (el, dx, dy) => {
    const rect = el.getBoundingClientRect();
    el.style.left = `${rect.left + dx}px`;
    el.style.top = `${rect.top + dy}px`;
  },
});
```

## API 参考

### Draggable(target: HTMLElement, options: DragOptions)

创建可拖拽实例：

- target: 需要设置为可拖拽的 HTML 元素
- options: 配置选项

| 选项             | 类型                                                | 描述            |
|----------------|---------------------------------------------------|---------------|
| data           | Record\<string, any>                              | 随拖拽事件传递的自定义数据 |
| dropTargets    | DropTargets                                       | 拖放目标配置        |
| onDragStart    | (event: DragEvent) => boolean                     | 拖拽开始时触发       |
| onDragMove     | (event: DragEvent) => void                        | 拖拽移动时触发       |
| onDragEnd      | (event: DragEvent) => void                        | 拖拽结束时触发       |
| setupProxy     | (proxy: HTMLElement, event: DragEvent) => void    | 自定义代理元素设置     |
| updatePosition | (el: HTMLElement, dx: number, dy: number) => void | 自定义位置更新逻辑     |

### DropTargets

| 选项       | 类型                                   | 描述          |
|----------|--------------------------------------|-------------|
| selector | ((el: Element) => boolean) \| string | 拖放目标选择器     |
| onEnter  | (event: DragEvent) => void           | 进入拖放目标时触发   |
| onLeave  | (event: DragEvent) => void           | 离开拖放目标时触发   |
| onDrop   | (event: DragEvent) => void           | 在拖放目标上释放时触发 |

### DragEvent

| 选项            | 类型                                       | 描述     |
|---------------|------------------------------------------|--------|
| data          | Record\<string, any>                     | 自定义数据  |
| originalEvent | MouseEvent \| PointerEvent \| TouchEvent | 原始事件对象 |
| phase         | 'start' \| 'move' \| 'end'               | 拖拽阶段   |
| proxy         | HTMLElement                              | 代理元素   |
| target        | HTMLElement                              | 原始拖拽元素 |

## 贡献

欢迎贡献代码！如果您发现任何问题或有改进建议，请随时提交 issue 或 pull request

## License

[MIT](https://opensource.org/licenses/MIT)

