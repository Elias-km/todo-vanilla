import { createTodoStore } from './todoStore/todoStore.js';
import { saveTodos } from './todoStorage/todoStorage.js';
import { bootstrapTodos } from './bootstrap.js';
import { shareTodos } from './shareTodos/shareTodos.js';

import { createTodoForm } from './components/TodoForm/TodoForm.js';
import { createTodoList } from './components/TodoList/TodoList.js';

export function initApp(container) {
  const store = createTodoStore(bootstrapTodos());

  const openAddButton = container.querySelector('[data-open-add]');
  const removeButton = container.querySelector('[data-remove]');
  const undoButton = container.querySelector('[data-undo]');
  const redoButton = container.querySelector('[data-redo]');
  const status = container.querySelector('[data-status]');
  const shareButton = container.querySelector('[data-share]');
  const shareFeedback = container.querySelector('[data-share-feedback]');

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

  shareButton.addEventListener('click', async () => {
    shareFeedback.hidden = true;

    const result = await shareTodos(store.getState().todos);

    if (result === 'copied') {
      shareFeedback.textContent = 'List copied to clipboard.';
      shareFeedback.hidden = false;
    } else if (result === 'failed') {
      shareFeedback.textContent = 'Unable to share or copy the list.';
      shareFeedback.hidden = false;
    }
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

    shareButton.disabled = state.todos.length === 0;
    shareFeedback.hidden = true;
  }

  store.subscribe(render);
  render(store.getState());
}