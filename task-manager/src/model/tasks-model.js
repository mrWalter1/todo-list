import { tasks } from '../mock/task.js';

export default class TasksModel {
  #tasks = tasks;

  getTasks() {
    return this.#tasks;
  }
}