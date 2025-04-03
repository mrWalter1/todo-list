import { createElement } from '../framework/render.js';

function createTaskComponentTemplate(task) {
  const { title, status } = task;
  return `
    <div class="task-item task--${status}">
      <p>${title}</p>
    </div>
  `;
}

export default class TaskComponent {
  #task = null;

  constructor(task) {
    this.#task = task;
  }

  getTemplate() {
    return createTaskComponentTemplate(this.#task);
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