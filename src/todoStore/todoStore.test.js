
import { describe, it, expect, vi } from 'vitest';
import { createTodoStore } from './todoStore.js';

describe('todoStore', () => {
  it('añade una tarea eliminando espacios exteriores', () => {
    const store = createTodoStore();

    expect(store.addTodo('  Comprar pan  ')).toBe(true);
    expect(store.getState().todos[0].text).toBe('Comprar pan');
  });

  it('no permite tareas vacías', () => {
    const store = createTodoStore();

    expect(store.addTodo('   ')).toBe(false);
    expect(store.addTodo('')).toBe(false);
    expect(store.getState().todos).toHaveLength(0);
  });

  it('genera identificadores únicos', () => {
    const store = createTodoStore();

    store.addTodo('Tarea');
    store.addTodo('Tarea');

    const [first, second] = store.getState().todos;
    expect(first.id).not.toBe(second.id);
  });

  it('selecciona y deselecciona tareas', () => {
    const store = createTodoStore();
    store.addTodo('Tarea');

    const { id } = store.getState().todos[0];

    store.toggleSelection(id);
    expect(store.getState().selectedIds.has(id)).toBe(true);

    store.toggleSelection(id);
    expect(store.getState().selectedIds.has(id)).toBe(false);
  });

  it('elimina varias tareas seleccionadas', () => {
    const store = createTodoStore();
    store.addTodo('Primera');
    store.addTodo('Segunda');

    const [first, second] = store.getState().todos;

    store.toggleSelection(first.id);
    store.toggleSelection(second.id);
    expect(store.removeSelected()).toBe(true);

    expect(store.getState().todos).toHaveLength(0);
  });

  it('no elimina sin selección', () => {
    const store = createTodoStore();
    store.addTodo('Tarea');

    expect(store.removeSelected()).toBe(false);
    expect(store.getState().todos).toHaveLength(1);
  });

  it('elimina una tarea por identificador', () => {
    const store = createTodoStore();
    store.addTodo('Primera');
    store.addTodo('Segunda');

    const { id } = store.getState().todos[0];

    expect(store.removeTodo(id)).toBe(true);
    expect(store.getState().todos[0].text).toBe('Segunda');
  });

  it('deshace la última operación', () => {
    const store = createTodoStore();
    store.addTodo('Primera');
    store.addTodo('Segunda');

    store.undo();

    expect(store.getState().todos).toHaveLength(1);
    expect(store.getState().todos[0].text).toBe('Primera');
  });

  it('restaura tareas eliminadas al deshacer', () => {
    const store = createTodoStore();
    store.addTodo('Tarea');

    const { id } = store.getState().todos[0];

    store.removeTodo(id);
    store.undo();

    expect(store.getState().todos[0].id).toBe(id);
  });

  it('notifica los cambios y permite cancelar la suscripción', () => {
    const store = createTodoStore();
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);

    store.addTodo('Primera');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.addTodo('Segunda');

    expect(listener).toHaveBeenCalledTimes(1);
  });
});


describe('todoStore - redo', () => {
  it('rehace un cambio deshecho', () => {
    const store = createTodoStore();

    store.addTodo('Primera');
    store.addTodo('Segunda');

    store.undo();
    expect(store.getState().todos).toHaveLength(1);

    store.redo();
    expect(store.getState().todos).toHaveLength(2);
  });

  it('permite múltiples undo y redo', () => {
    const store = createTodoStore();

    store.addTodo('Primera');
    store.addTodo('Segunda');
    store.addTodo('Tercera');

    store.undo();
    store.undo();

    expect(store.getState().todos).toHaveLength(1);

    store.redo();
    store.redo();

    expect(store.getState().todos).toHaveLength(3);
  });

  it('invalida redo al realizar una nueva modificación', () => {
    const store = createTodoStore();

    store.addTodo('Primera');
    store.addTodo('Segunda');
    store.undo();

    expect(store.getState().canRedo).toBe(true);

    store.addTodo('Nueva');

    expect(store.getState().canRedo).toBe(false);
    expect(store.redo()).toBe(false);
  });

  it('no invalida redo al cambiar la selección', () => {
    const store = createTodoStore();

    store.addTodo('Primera');
    store.addTodo('Segunda');
    store.undo();

    const { id } = store.getState().todos[0];
    store.toggleSelection(id);

    expect(store.getState().canRedo).toBe(true);
  });
});

