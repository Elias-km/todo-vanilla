
import html from './TodoForm.html?raw';
import styles from './TodoForm.module.css';

export function createTodoForm({ onAdd }) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();

  const form = template.content.firstElementChild;
  const input = form.querySelector('input');

  form.className = styles.form;
  form.querySelector('[data-controls]').className = styles.controls;
  input.className = styles.input;
  form.querySelector('button').className = styles.button;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    if (onAdd(text)) {
      input.value = '';
      input.focus();
    }
  });

  return form;
}
