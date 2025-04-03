import TasksListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import TaskBoardComponent from '../view/board-component.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';
import ClearBasketComponent from '../view/clear-basket-component.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = this.#tasksModel.getTasks();
    render(this.#tasksBoardComponent, this.#boardContainer);

    const statusList = [
      Status.BACKLOG,
      Status.PROCESSING,
      Status.DONE,
      Status.BASKET
    ];

    statusList.forEach((status) => {
      const taskListComponent = new TasksListComponent(StatusLabel[status], status);
      render(taskListComponent, this.#tasksBoardComponent.getElement());

      const tasksByStatus = this.#boardTasks.filter(task => task.status === status);
      tasksByStatus.forEach((task) => {
        const taskComponent = new TaskComponent(task);
        render(taskComponent, taskListComponent.getElement());
      });

      if (status === Status.BASKET) {
        const clearBasketComponent = new ClearBasketComponent();
        render(clearBasketComponent, taskListComponent.getElement());
      }
    });
  }
}