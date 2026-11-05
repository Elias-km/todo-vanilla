
import { createTodoStore } from './todoStore/todoStore.js';
import { loadTodos, saveTodos } from './todoStorage/todoStorage.js';

import { createTodoForm } from './components/TodoForm/TodoForm.js';
import { createTodoList } from './components/TodoList/TodoList.js';

export function initApp(container) {
  const store = createTodoStore(loadTodos());

  const removeButton = container.querySelector('[data-remove]');
  const undoButton = container.querySelector('[data-undo]');
  const redoButton = container.querySelector('[data-redo]');

  // Ejecuta cambios y guarda las tareas.
  function commit(action) {
    const changed = action();

    if (changed) {
      saveTodos(store.getState().todos);
    }

    return changed;
  }

  // Componentes
  const form = createTodoForm({
    onAdd: (text) => commit(() => store.addTodo(text)),
  });

  const list = createTodoList({
    onToggle: (id) => store.toggleSelection(id),
    onRemove: (id) => commit(() => store.removeTodo(id)),
  });

  // Acciones generales
  removeButton.addEventListener('click', () => {
    commit(() => store.removeSelected());
  });

  undoButton.addEventListener('click', () => {
    commit(() => store.undo());
  });

  redoButton.addEventListener('click', () => {
    commit(() => store.redo());
  });

  // Montaje
  container.querySelector('[data-form-slot]').append(form);
  container.querySelector('[data-list-slot]').append(list.element);

  // Actualización de interfaz
  function render(state) {
    list.render(state);

    removeButton.disabled = state.selectedIds.size === 0;
    undoButton.disabled = !state.canUndo;
    redoButton.disabled = !state.canRedo;
  }

  store.subscribe(render);
  render(store.getState());
}
