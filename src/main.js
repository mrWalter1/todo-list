import HeaderComponent      from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TasksBoardPresenter  from './presenter/tasks-board-presenter.js';
import TasksModel           from './model/tasks-model.js';
import TasksApiService      from './api/tasks-api-service.js';
import { render, RenderPosition } from './framework/render.js';

const END_POINT      = 'https://681099a927f2fdac24120180.mockapi.io'; 
const bodyContainer  = document.querySelector('.board-app');
const formContainer  = document.querySelector('.add-task');
const boardContainer = document.querySelector('.taskboard');

const apiService = new TasksApiService(END_POINT);

const tasksModel = new TasksModel({ tasksApiService: apiService });

const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer,
  tasksModel
});

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);

const formAddTaskComponent = new FormAddTaskComponent({
  onClick: () => tasksBoardPresenter.createTask()
});
render(formAddTaskComponent, formContainer);

tasksBoardPresenter.init();
