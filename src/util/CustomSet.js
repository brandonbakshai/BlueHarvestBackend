'use strict';

class CustomSet {

  constructor() {
    this.map = new Map();
    this[Symbol.iterator] = this.values;
  }

  add(item) {
    if (item == null) {}
    else if (typeof item[Symbol.iterator] === 'function') {
      item.forEach(element => this.map.set(element.toString(), item));
    } else {
      this.map.set(item.toString(), item);
    }
  }

  delete(item) {
    if (item == null) {}
    else if (typeof item[Symbol.iterator] === 'function') {
      item.forEach(element => {
        if (this.map.has(element.toString())) {
          this.map.delete(element.toString());
        }
      });
    } else {
      this.map.delete(item.toString());
    }
  }

  has(item) {
    return this.map.has(item.toString());
  }

  values() {
    return this.map.values();
  }

  size() {
    return this.map.size;
  }

  equals(anotherSet) {
    if (this.size() !== anotherSet.size()) return false;

    for (const [key, val] of this.map) {
      if (!anotherSet.has(key)) return false;
    }

    return true;
  }
}

export default CustomSet;