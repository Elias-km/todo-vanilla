import { createTodoStore } from './todoStore/todoStore.js';
import { loadTodos, saveTodos } from './todoStorage/todoStorage.js';

import { createTodoForm } from './components/TodoForm/TodoForm.js';
import { createTodoList } from './components/TodoList/TodoList.js';

export function initApp(container) {
  const store = createTodoStore(loadTodos());

  const openAddButton = container.querySelector('[data-open-add]');
  const removeButton = container.querySelector('[data-remove]');
  const undoButton = container.querySelector('[data-undo]');
  const redoButton = container.querySelector('[data-redo]');
  const status = container.querySelector('[data-status]');

  function commit(action) {
    const changed = action();

    if (changed) {
      saveTodos(store.getState().todos);
    }

    return changed;
  }

  const form = createTodoForm({
    onAdd: (text) => commit(() => store.addTodo(text)),
  });

  const list = createTodoList({
    onToggle: (id) => store.toggleSelection(id),
    onRemove: (id) => commit(() => store.removeTodo(id)),
  });

  openAddButton.addEventListener('click', () => {
    form.open();
  });

  removeButton.addEventListener('click', () => {
    commit(() => store.removeSelected());
  });

  undoButton.addEventListener('click', () => {
    commit(() => store.undo());
  });

  redoButton.addEventListener('click', () => {
    commit(() => store.redo());
  });

  container.querySelector('[data-form-slot]').append(form.element);
  container.querySelector('[data-list-slot]').append(list.element);

  function render(state) {
    list.render(state);

    removeButton.disabled = state.selectedIds.size === 0;
    undoButton.disabled = !state.canUndo;
    redoButton.disabled = !state.canRedo;
    status.textContent =
    `${state.todos.length} items. ` +
    `${state.selectedIds.size} selected.`;
  }

  store.subscribe(render);
  render(store.getState());
}