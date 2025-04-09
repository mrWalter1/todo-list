import { AbstractComponent } from '../framework/view/abstract-component.js';

function createBoardTemplate() {
  // Теперь возвращаем div с классом task-board,
  // который станет контейнером для всех колонок доски
  return `<div class="task-board"></div>`;
}

export default class TaskBoardComponent extends AbstractComponent {
  get template() {
    return createBoardTemplate();
  }
}
