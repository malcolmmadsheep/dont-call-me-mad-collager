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
    .filter(figure => '0123456789'.contains(figure))
    .join('');

  return (checkedNum.length === numStr.length) ? parseInt(checkedNum) : null;
}