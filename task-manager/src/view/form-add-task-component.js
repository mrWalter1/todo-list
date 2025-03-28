import { createElement } from '../framework/render.js';

function createFormAddTaskComponentTemplate() {
  return `
    <div class="add-task compact-mode">
      <form class="add-task__form" aria-label="Форма добавления задачи">
        <h2 class="form-title">Новая задача</h2>
        <div class="add-task__input-wrapper">
          <input type="text" name="task-name" id="add-task" placeholder="Краткое название..." required>
          <button class="add-task__button button" type="submit">
            <span>Добавить</span>
          </button>
        </div>
      </form>
    </div>
  `;
}

export default class FormAddTaskComponent {
  getTemplate() {
    return createFormAddTaskComponentTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
