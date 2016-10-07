'use strict';

const document = window.document;

export default class DOMElement {
  constructor(element, children) {
    this._self = element;
    this._parent = null;
    this._children = {};
    if (children) {
      this.addChildren(children);
    }
    this._methods = {};
  }

  get self() {
    return this._self;
  }

  get parent() {
    return this._parent;
  }

  appendTo(domElement) {
    domElement.appendChild(this._self);

    return this;
  }

  addChild(childName, child, render) {
    if (Object.keys(this._children).includes(childName)) {
      throw new Error(`Child exists. Child with name "${childName}" already exists.`);
    }

    const DOMChild = this._children[childName] = child;
    child._setParent(this);

    if (render) {
      this._self.appendChild(child._self);
    }

    return this;
  }

  _setParent(parent) {
    this._parent = parent;
  }

  /**
   * 
   * 
   * @param {Object} children
   * @returns
   * 
   * @memberOf DOMElement
   */
  addChildren(children) {
    for (let childName in children) {
      if (children.hasOwnProperty(childName)) {
        this.addChild(childName, children[childName]);
      }
    }

    return this;
  }

  getChild(childName) {
    const child = this._findChild(childName, this._children);

    return child;
  }

  addListeners(listeners) {
    listeners.forEach(listener => {
      const { name, callback } = listener;

      const names = name.split(',');
      names.forEach(name => this._self.addEventListener(name, callback.bind(this), false));
    });
  }

  fireEvent(customEvent) {
    this._self.dispatchEvent(customEvent);
  }

  childrenToArray() {
    const children = [];

    for (let childName in this._children) {
      if (this._children.hasOwnProperty(childName)) {
        const child = this._children[childName];

        children.push(child);
      }
    }

    return children;
  }

  getStyle(name) {
    return this._self.style[name] || window.getComputedStyle(this._self, null)[name];
  }

  setStyle(name, value) {
    this._self.style[name] = value;

    return this;
  }

  getProp(name) {
    return this._self[name];
  }

  setProp(name, value) {
    this._self[name] = value;

    return this;
  }

  getAttr(name) {
    return this._self.getAttribute(name);
  }

  setAttr(name, value) {
    this._self.setAttribute(name, value);

    return this;
  }

  addClass(className) {
    this._self.classList.add(className);
  }

  removeClass(className) {
    this._self.classList.remove(className);
  }

  register(methodName, f) {
    if (!this._methods[methodName]) {
      this._methods[methodName] = f.bind(this);
    } else {
      throw new Error(`Method exists. Method "${methodName}" already exists.`);
    }
  }

  run(methodName, options) {
    if (typeof this._methods[methodName] === 'function') {
      this._methods[methodName](options);
    } else {
      throw new Error(`Wrong method name.\nThere is no method with name "${methodName}".`);
    }

    return this;
  }

  _findChild(childName, children) {
    if (!children) {
      return null;
    } else if (children.hasOwnProperty(childName)) {
      return children[childName];
    } else {
      let necessaryChild;

      for (let elementName in children) {
        const child = children[elementName];

        if (!child) {
          throw new Error(`Wrong childname! There is no child with name "${elementName}".`)
        }

        necessaryChild = this._findChild(childName, child._children);

        if (necessaryChild) {
          return necessaryChild;
        }
      }
    }
  }
}