import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import BoardComponent from './view/board-component.js';
import TaskListComponent from './view/task-list-component.js';
import TaskComponent from './view/task-component.js';
import { render, RenderPosition } from './framework/render.js';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const boardContainer = document.querySelector('.taskboard');

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new FormAddTaskComponent(), formContainer);
render(new BoardComponent(), boardContainer);

const taskCategories = ['Бэклог', 'В процессе', 'Готово', 'Корзина'];
taskCategories.forEach(category => {
  const listComponent = new TaskListComponent(category);
  render(listComponent, boardContainer);

  for (let i = 0; i < 3; i++) {
    render(new TaskComponent(`Название первой задачи`), listComponent.getElement());
  }
});
