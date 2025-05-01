import Observable from '../framework/view/observable.js';
import { generateID } from '../utils.js';
import { UserAction, UpdateType } from '../const.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardTasks     = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  // Геттер для всего массива задач
  get tasks() {
    return this.#boardTasks;
  }

  // Инициализация: загружаем задачи с сервера и уведомляем INIT
  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardTasks = tasks;
    } catch (err) {
      this.#boardTasks = [];
    }
    this._notify(UpdateType.INIT);
  }

  // Фильтрация по статусу — используются презентером
  getTasksByStatus(status) {
    return this.#boardTasks.filter(task => task.status === status);
  }

  // Добавление задачи на сервер и в локальный массив
  async addTask(title) {
    const newTask = {
      id:     generateID(),
      title,
      status: 'backlog',
    };
    try {
      const created = await this.#tasksApiService.addTask(newTask);
      this.#boardTasks.push(created);
      this._notify(UserAction.ADD_TASK, created);
      return created;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);
      throw err;
    }
  }

  // Обновление статуса (и позиции) задачи на сервере и локально
  async updateTaskStatus(taskId, newStatus, beforeId = null) {
    const idx = this.#boardTasks.findIndex(t => t.id === taskId);
    if (idx === -1) return;

    const updatedLocal = { ...this.#boardTasks[idx], status: newStatus };

    try {
      const updated = await this.#tasksApiService.updateTask(updatedLocal);
      // Убираем старую запись
      this.#boardTasks.splice(idx, 1);
      // Вставляем на новое место
      if (beforeId) {
        const refIdx = this.#boardTasks.findIndex(t => t.id === beforeId);
        this.#boardTasks.splice(refIdx, 0, updated);
      } else {
        this.#boardTasks.push(updated);
      }
      this._notify(UserAction.UPDATE_TASK, updated);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи на сервере:', err);
      throw err;
    }
  }

  // Удаление одной задачи
  async deleteTask(taskId) {
    try {
      await this.#tasksApiService.deleteTask(taskId);
      this.#boardTasks = this.#boardTasks.filter(t => t.id !== taskId);
      this._notify(UserAction.DELETE_TASK, { id: taskId });
    } catch (err) {
      console.error('Ошибка при удалении задачи на сервере:', err);
      throw err;
    }
  }

  // Очистка всей корзины: удаляем все задачи со статусом basket
  async clearBasketTasks() {
    const basketIds = this.#boardTasks
      .filter(t => t.status === 'basket')
      .map(t => t.id);
    try {
      await Promise.all(basketIds.map(id => this.#tasksApiService.deleteTask(id)));
      this.#boardTasks = this.#boardTasks.filter(t => t.status !== 'basket');
      // Сообщаем, что удалены все из корзины
      this._notify(UserAction.DELETE_TASK, { status: 'basket' });
    } catch (err) {
      console.error('Ошибка при очистке корзины на сервере:', err);
      throw err;
    }
  }

  // Помощник для блокировки/разблокировки кнопки очистки корзины
  hasBasketTasks() {
    return this.#boardTasks.some(t => t.status === 'basket');
  }
}

