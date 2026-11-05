
export function createTodoStore(initialTodos = []) {
  let todos = initialTodos.map((todo) => ({ ...todo }));
  let selectedIds = new Set();

  const history = [];
  const future = [];
  const listeners = new Set();

  function snapshot() {
    return todos.map((todo) => ({ ...todo }));
  }

  function getState() {
    return {
      todos: snapshot(),
      selectedIds: new Set(selectedIds),
      canUndo: history.length > 0,
      canRedo: future.length > 0,
    };
  }

  function notify() {
    listeners.forEach((listener) => listener(getState()));
  }

  function saveHistory() {
    history.push(snapshot());
    future.length = 0;
  }

  function addTodo(text) {
    const value = typeof text === 'string' ? text.trim() : '';

    if (!value) return false;

    saveHistory();

    todos = [
      ...todos,
      { id: crypto.randomUUID(), text: value },
    ];

    notify();
    return true;
  }

  function toggleSelection(id) {
    if (!todos.some((todo) => todo.id === id)) return false;

    if (selectedIds.has(id)) {
      selectedIds.delete(id);
    } else {
      selectedIds.add(id);
    }

    notify();
    return true;
  }

  function removeTodo(id) {
    if (!todos.some((todo) => todo.id === id)) return false;

    saveHistory();

    todos = todos.filter((todo) => todo.id !== id);
    selectedIds.delete(id);

    notify();
    return true;
  }

  function removeSelected() {
    if (selectedIds.size === 0) return false;

    saveHistory();

    todos = todos.filter((todo) => !selectedIds.has(todo.id));
    selectedIds.clear();

    notify();
    return true;
  }

  function undo() {
    if (history.length === 0) return false;

    future.push(snapshot());
    todos = history.pop();
    selectedIds.clear();

    notify();
    return true;
  }

  function redo() {
    if (future.length === 0) return false;

    history.push(snapshot());
    todos = future.pop();
    selectedIds.clear();

    notify();
    return true;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return {
    getState,
    addTodo,
    toggleSelection,
    removeTodo,
    removeSelected,
    undo,
    redo,
    subscribe,
  };
}
