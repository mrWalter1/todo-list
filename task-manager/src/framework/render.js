import { AbstractComponent } from "./view/abstract-component.js";

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend'
};

export function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
}

export function render(component, container, place = RenderPosition.BEFOREEND) {
  if (!(component instanceof AbstractComponent)) {
    throw new Error("Can render only components");
  }
  if (container === null) {
    throw new Error("Container element doesn't exist");
  }
  container.insertAdjacentElement(place, component.element);
}

export function remove(component) {
  if (component && component.element) {
    component.element.remove();
    component.removeElement();
  }
}

