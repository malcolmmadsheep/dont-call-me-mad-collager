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