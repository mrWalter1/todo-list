// src/presenter/tasks-board-presenter.js
import TaskBoardComponent     from '../view/task-board-component.js';
import TaskListComponent      from '../view/task-list-component.js';
import TaskComponent          from '../view/task-component.js';
import ClearBasketComponent   from '../view/clear-basket-component.js';
import LoadingViewComponent   from '../view/loading-view-component.js';
import PlaceholderComponent   from '../view/placeholder-component.js';
import { render, remove }     from '../framework/render.js';
import { Status, StatusLabel, UserAction, UpdateType } from '../const.js';

export default class TasksBoardPresenter {
  #boardContainer;
  #tasksModel;
  #boardComponent      = new TaskBoardComponent();
  #loadingComponent    = new LoadingViewComponent();
  #resetButtonComponent = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel     = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelEvent.bind(this));
  }

  async init() {
    render(this.#loadingComponent, this.#boardContainer);
    try {
      await this.#tasksModel.init();
    } catch(err) {
      console.error('Ошибка при инициализации модели:', err);
    } finally {
      remove(this.#loadingComponent);
    }
  }

  // 2) Общий обработчик событий модели
  #handleModelEvent(eventType, payload) {
    switch (eventType) {
      case UpdateType.INIT:
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
        this.#clearBoard();
        this.#renderBoard();
        // Обновляем состояние кнопки очистки корзины
        if (this.#resetButtonComponent) {
          this.#resetButtonComponent.toggleDisabled(
            !this.#tasksModel.hasBasketTasks()
          );
        }
        break;
    }
  }

  // 3) Рисуем всю доску и все колонки
  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    Object.values(Status).forEach(status => {
      const listComponent = new TaskListComponent({
        title:       StatusLabel[status],
        statusClass: status,
        onTaskDrop:  this.#handleTaskDrop.bind(this),
      });
      render(listComponent, this.#boardComponent.element);
      this.#renderTasksList(status, listComponent.element);

      if (status === Status.BASKET) {
        const clearBtn = new ClearBasketComponent({
          onClick: this.#handleClearBasketClick.bind(this)
        });
        render(clearBtn, listComponent.element);
        this.#resetButtonComponent = clearBtn;
        clearBtn.toggleDisabled(!this.#tasksModel.hasBasketTasks());
      }
    });
  }

  // 4) Рисуем задачи или заглушку в конкретной колонке
  #renderTasksList(status, container) {
    const tasks = this.#tasksModel.getTasksByStatus(status);
    if (tasks.length === 0) {
      render(new PlaceholderComponent(), container);
    } else {
      tasks.forEach(task => this.#renderTask(task, container));
    }
  }

  // 5) Рисуем одну карточку задачи
  #renderTask(task, container) {
    render(new TaskComponent({ task }), container);
  }

  // 6) Очищаем HTML-контейнер доски перед полной перерисовкой
  #clearBoard() {
    this.#boardComponent.element.innerHTML = '';
  }

  // 7) Создание новой задачи из формы
  async createTask() {
    const input = document.querySelector('#add-task');
    const title = input.value.trim();
    if (!title) return;
    try {
      await this.#tasksModel.addTask(title);
      input.value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }

  // 8) Обработчик перетаскивания задачи
  async #handleTaskDrop(taskId, newStatus, beforeId) {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus, beforeId);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
  }

  // 9) Обработчик очистки корзины
  async #handleClearBasketClick() {
    try {
      await this.#tasksModel.clearBasketTasks();
    } catch (err) {
      console.error('Ошибка при очистке корзины:', err);
    }
  }
}
