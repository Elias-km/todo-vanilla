
import html from './TodoList.html?raw';
import styles from './TodoList.module.css';
import { createTodoItem } from '../TodoItem/TodoItem.js';

export function createTodoList({ onToggle, onRemove }) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();

  const element = template.content.firstElementChild;
  const list = element.querySelector('[data-list]');
  const empty = element.querySelector('[data-empty]');

  list.className = styles.list;
  empty.className = styles.empty;
  element.className = styles.container;

  let currentIds = [];
  let items = new Map();

  function render({ todos, selectedIds }) {
    const ids = todos.map((todo) => todo.id);
    const sameItems =
      ids.length === currentIds.length &&
      ids.every((id, index) => id === currentIds[index]);

    if (!sameItems) {
      const fragment = document.createDocumentFragment();
      items = new Map();

      todos.forEach((todo) => {
        const item = createTodoItem({
          todo,
          selected: selectedIds.has(todo.id),
          onToggle,
          onRemove,
        });

        items.set(todo.id, item);
        fragment.append(item.element);
      });

      list.replaceChildren(fragment);
      currentIds = ids;
    } else {
      todos.forEach((todo) => {
        items.get(todo.id).setSelected(selectedIds.has(todo.id));
      });
    }

    empty.hidden = todos.length > 0;
  }

  return { element, render };
}
