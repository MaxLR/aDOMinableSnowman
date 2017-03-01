class DomNodeCollection {
  constructor(elements) {
    this.elements = elements;
    // return this;
  }

  html(string) {
    if(string) {
      this.elements.forEach ((el) => {
        el.innerHTML = string;
      });
    }
    else {
      return this.elements[0].innerHTML;
    }
  }

  empty() {
    this.elements.forEach( (el) => {
      for (var i = 0; i < el.children.length; i++) {
        el.children[i].innerHTML = "";
      }
    });
  }

  append (input) {
    if (input instanceof DomNodeCollection) {
      this.elements.forEach( (el) => {
        for (var j = 0; j < input.elements.length; j++) {
          el.innerHTML += input.elements[j].outerHTML;
        }
      });
    } else {
      this.elements.forEach ( (el) => {
        el.innerHTML += input;
      });
    }
  }

  attr(key, value) {
    this.elements.forEach((el) => {
      el.setAttribute(key, value);
    });
  }

  addClass(value) {
    this.elements.forEach( (el) => {
      el.className += ` ${value}`;
    });
  }

  removeClass(value) {
    this.elements.forEach( (el) => {
      el.className = el.className.replace(` ${value}`, "");
    });
  }

  children() {
    let children = [];
    this.elements.forEach ( (el) => {
      for (var i = 0; i < el.children.length; i++) {
        children.push(el.children[i]);
      }
    });
    return new DomNodeCollection(children);
  }

  parent() {
    let parents = [];
    this.elements.forEach ( (el) => {
      parents.push(el.parentElement);
    });
    return new DomNodeCollection(parents);
  }

  find(search) {
    let results = [];
    this.elements.forEach ( (el) => {
      let tempList = el.querySelectorAll(search);
      if (tempList.length > 0) {
        results = results.concat(el.querySelectorAll(search));
      }
    });

    return new DomNodeCollection(results);
  }

  remove() {
    this.elements.forEach ( (el) => {
      el.outerHTML = "";
    });
  }

  on(listener, callback) {
    this.elements.forEach((el) => {
      el.addEventListener(listener, callback);
      el.callback = callback;
    });
  }

  off(listener) {
    this.elements.forEach((el) => {
      el.removeEventListener(listener, el.callback);
    });
  }
}

module.exports = DomNodeCollection;
