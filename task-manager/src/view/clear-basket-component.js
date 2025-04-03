import { createElement } from '../framework/render.js';

function createClearBasketTemplate() {
  return `<button class="clear-basket-button">Очистить корзину</button>`;
}

export default class ClearBasketComponent {
  getTemplate() {
    return createClearBasketTemplate();
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