import { createElement } from '../framework/render.js';
import TaskListComponent from './task-list-component.js';

function createBoardTemplate() {
  return '<section class="tasks-section"></section>';
}

export default class TaskBoardComponent {
  constructor() {
    this.lists = [
      { title: 'Бэклог', type: 'pending' },
      { title: 'В процессе', type: 'in-progress' },
      { title: 'Готово', type: 'completed' },
      { title: 'Корзина', type: 'discarded' }
    ];
  }

  getTemplate() {
    return createBoardTemplate();
  }

  renderLists() {
    const container = this.getElement().querySelector('.tasks-section');
    this.lists.forEach(list => {
      const taskList = new TaskListComponent(list.title, list.type);
      container.append(taskList.getElement());
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.renderLists();
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}