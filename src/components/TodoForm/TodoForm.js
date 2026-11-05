
import html from './TodoForm.html?raw';
import styles from './TodoForm.module.css';

export function createTodoForm({ onAdd }) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();

  const dialog = template.content.firstElementChild;
  const modal = dialog.querySelector('[data-modal]');
  const form = dialog.querySelector('form');
  const input = dialog.querySelector('input');
  const actions = dialog.querySelector('[data-actions]');
  const submitButton = dialog.querySelector('[data-submit]');
  const cancelButton = dialog.querySelector('[data-cancel]');

  dialog.className = styles.backdrop;
  modal.className = styles.modal;
  form.className = styles.form;
  input.className = styles.input;
  actions.className = styles.actions;
  submitButton.className = styles.primaryButton;
  cancelButton.className = styles.secondaryButton;

  function open() {
    if (dialog.open) return;

    dialog.showModal();
    input.focus();
  }

  function finishClose() {
    dialog.close();
    dialog.classList.remove(styles.closing);
    form.reset();
  }

  function close() {
    if (!dialog.open || dialog.classList.contains(styles.closing)) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose();
      return;
    }

    dialog.classList.add(styles.closing);
  }

  dialog.addEventListener('animationend', (event) => {
    if (
      event.target === dialog &&
      dialog.classList.contains(styles.closing)
    ) {
      finishClose();
    }
  });

  // Escape y solicitudes nativas de cierre
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  // Cerrar al pulsar fuera del contenido
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      close();
    }
  });

  cancelButton.addEventListener('click', close);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    if (onAdd(text)) {
      close();
    }
  });

  return {
    element: dialog,
    open,
    close,
  };
}
