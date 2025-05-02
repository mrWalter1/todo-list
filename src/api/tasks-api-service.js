import ApiService from '../framework/view/api-service.js';

const Method = {
  GET:    'GET',
  POST:   'POST',
  PUT:    'PUT',
  DELETE: 'DELETE',
};

export default class TasksApiService extends ApiService {
  get tasks() {
    return this._load({url: 'tasks', method: Method.GET})
      .then(ApiService.parseResponse);
  }

  addTask(task) {
    return this._load({
      url: 'tasks',
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': 'application/json'}),
    }).then(ApiService.parseResponse);
  }

  updateTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': 'application/json'}),
    }).then(ApiService.parseResponse);
  }

  deleteTask(taskId) {
    return this._load({
      url: `tasks/${taskId}`,
      method: Method.DELETE,
    });
  }
}
