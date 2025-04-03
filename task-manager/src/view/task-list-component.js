import { createElement } from '../framework/render.js';

function createTaskListComponentTemplate(title, statusClass) {
  return `
    <ul class="task-category ${statusClass}">
      <h3 class="category-title">${title}</h3>
    </ul>
  `;
}

export default class TaskListComponent {
  constructor(title, statusClass) {
    this.title = title;
    this.statusClass = statusClass;
  }

  getTemplate() {
    return createTaskListComponentTemplate(this.title, this.statusClass);
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