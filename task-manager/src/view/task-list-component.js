import { createElement } from '../framework/render.js';

function createTaskListComponentTemplate(title) {
  return `<ul class="task-category">
            <h3 class="category-title">${title}</h3>
          </ul>`;
}

export default class TaskListComponent {
  constructor(title) {
    this.title = title;
  }

  getTemplate() {
    return createTaskListComponentTemplate(this.title);
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
