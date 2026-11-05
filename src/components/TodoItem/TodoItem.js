
import html from './TodoItem.html?raw';
import styles from './TodoItem.module.css';

export function createTodoItem({ todo, selected, onToggle, onRemove }) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();

  const element = template.content.firstElementChild;
  const button = element.querySelector('[data-todo]');

  element.className = styles.item;
  button.className = styles.button;
  button.textContent = todo.text;

  function setSelected(value) {
    button.classList.toggle(styles.selected, value);
    button.setAttribute('aria-pressed', String(value));
  }

  button.addEventListener('click', () => onToggle(todo.id));
  button.addEventListener('dblclick', () => onRemove(todo.id));

  setSelected(selected);

  return { element, setSelected };
}
