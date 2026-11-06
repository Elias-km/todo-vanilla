
// @vitest-environment jsdom

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { initApp } from '../../src/app.js';

// HTML mínimo necesario para montar la aplicación.
const markup = `
  <main id="app">
    <button type="button" data-open-add>ADD</button>
    <button type="button" data-remove disabled>DELETE</button>
    <button type="button" data-undo disabled>UNDO</button>
    <button type="button" data-redo disabled>REDO</button>
    <button type="button" data-share disabled>SHARE</button>

    <div data-list-slot></div>
    <div data-form-slot></div>

    <p data-status role="status"></p>
    <p data-share-feedback role="status" hidden></p>
  </main>
`;


// jsdom no implementa completamente el comportamiento de <dialog>.
// Simulamos únicamente sus métodos nativos.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };

  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };

  // Evitamos depender de animaciones CSS en tests funcionales.
  window.matchMedia = () => ({ matches: true });
});

function mountApp() {
  document.body.innerHTML = markup;
  initApp(document.querySelector('#app'));
}

function getItems() {
  return [...document.querySelectorAll('[data-todo]')];
}

function click(selector) {
  document.querySelector(selector).click();
}

function addTask(text) {
  click('[data-open-add]');

  const dialog = document.querySelector('dialog');
  dialog.querySelector('input').value = text;
  dialog.querySelector('[data-submit]').click();
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('todo-vanilla:todos', '[]');
  mountApp();
});

describe('App integration', () => {
  it('abre y cierra el modal', () => {
    const dialog = document.querySelector('dialog');

    expect(dialog.open).toBe(false);

    click('[data-open-add]');
    expect(dialog.open).toBe(true);

    click('[data-cancel]');
    expect(dialog.open).toBe(false);
  });

  it('añade una tarea y la guarda', () => {
    addTask('Comprar pan');

    expect(getItems()).toHaveLength(1);
    expect(getItems()[0].textContent).toBe('Comprar pan');

    const saved = JSON.parse(
      localStorage.getItem('todo-vanilla:todos')
    );

    expect(saved[0].text).toBe('Comprar pan');
  });

  it('impide añadir tareas vacías', () => {
    addTask('   ');

    expect(getItems()).toHaveLength(0);
    expect(document.querySelector('dialog').open).toBe(true);
  });

  it('selecciona y elimina varias tareas', () => {
    addTask('Primera');
    addTask('Segunda');

    const items = getItems();
    items[0].click();
    items[1].click();

    const removeButton = document.querySelector('[data-remove]');
    expect(removeButton.disabled).toBe(false);

    removeButton.click();

    expect(getItems()).toHaveLength(0);
    expect(removeButton.disabled).toBe(true);
  });

  it('permite eliminar con doble clic', () => {
    addTask('Eliminar');

    getItems()[0].dispatchEvent(
      new MouseEvent('dblclick', { bubbles: true })
    );

    expect(getItems()).toHaveLength(0);
  });

  it('deshace y rehace modificaciones', () => {
    addTask('Primera');
    addTask('Segunda');

    click('[data-undo]');
    expect(getItems()).toHaveLength(1);

    click('[data-redo]');
    expect(getItems()).toHaveLength(2);
  });

  it('invalida rehacer después de una nueva modificación', () => {
    addTask('Primera');
    addTask('Segunda');

    click('[data-undo]');
    addTask('Tercera');

    expect(document.querySelector('[data-redo]').disabled).toBe(true);
    expect(getItems().map((item) => item.textContent)).toEqual([
      'Primera',
      'Tercera',
    ]);
  });

  it('recupera las tareas al reiniciar la aplicación', () => {
    addTask('Persistente');

    mountApp();

    expect(getItems()).toHaveLength(1);
    expect(getItems()[0].textContent).toBe('Persistente');

    // El historial no se conserva después de reiniciar.
    expect(document.querySelector('[data-undo]').disabled).toBe(true);
    expect(document.querySelector('[data-redo]').disabled).toBe(true);
  });


    it('inicializa tareas solo en la primera ejecución', () => {
    localStorage.clear();
    mountApp();

    expect(getItems().map((item) => item.textContent)).toEqual([
        'Plan my week',
        'Buy groceries',
        'Finish my personal project',
    ]);

    // Eliminar todas las tareas iniciales.
    getItems().forEach((item) => item.click());
    click('[data-remove]');

    expect(getItems()).toHaveLength(0);

    // Simular una nueva carga de la aplicación.
    mountApp();

    // Las tareas iniciales no deben reaparecer.
    expect(getItems()).toHaveLength(0);
    });

});
