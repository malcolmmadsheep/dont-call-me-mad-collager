'use strict';

export default class DOMElement {
  constructor(element) {
    this._self = element;
    this._children = null;
  }

  get self() {
    return this._self;
  }

  addChild(childName, child) {
    if (!this._children) {
      this._children = {};
    }

    const DOMChild = this._children[childName] = new DOMElement(child);

    return this;
  }

  getChild(childName) {
    let child = _findChild(childName);
  }

  _findChild(childName, children) {
    if (!children) {
      return null;
    } else if (children.hasOwnProperty(childName)) {
      return children[childName];
    } else {
      for (let elementName in children) {
        const child = children[elementName];

        return _findChild(childName, child._children);
      }
    }
  }
}