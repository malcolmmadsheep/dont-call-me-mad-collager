'use strict';

export function toArray(list) {
  const array = [];

  for (let i = 0, listLength = list.length; i < listLength; i += 1) {
    array.push(list[i]);
  }

  return array;
}

export function toPx(value) {
  return `${value}px`;
}

export function checkNum(numStr) {
  const checkedNum = numStr.trim().split('')
    .filter(figure => '0123456789'.includes(figure))
    .join('');

  return (checkedNum.length === numStr.length) ? parseInt(checkedNum) : null;
}

export function createElement(tagName, options) {
  const element = document.createElement(tagName);

  for (let option in options) {
    if (options.hasOwnProperty(option)) {
      element[option] = options[option];
    }
  }

  return element;
}

export function appendChildren(children, to) {
  children.forEach(child => to.append(child));
}