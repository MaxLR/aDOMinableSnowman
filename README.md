# aDOMinableSnowman.js

aDOMinableSnowman is a  lightweight DOM manipulation library inspired by jQuery.

## Getting Started

Download the project folder and run `webpack --watch` to compile the files. Then
copy the full path of the index.html file, and open that in a browser.

## Basic Structure

The core class of aDOMinableSnowman.js is `DOMNodeCollection`. It contains an array of all DOM elements and its functions use the class' `forEach` function to call the function on each DOM element. As an example:

```javascript
empty() {
  this.elements.forEach( (el) => {
    for (var i = 0; i < el.children.length; i++) {
      el.children[i].innerHTML = "";
    }
  });
}
```

### DOM Selection

The function `$a` is the selector. You can select DOM elements by their class, ids, or HTML element type. This
yields the result as an array of `DOMNodeCollection` objects that match the selector's argument.

#### Functions

Once you have the DOM elements selected, there are a few functions you can use to manipulate them.

- `append(content)`: adds `content` to the end of the selected `DOMNodeCollection`'s `elements` array, or body depending on what has been selected.
- `addClass(className)`: adds a `className` to the selected DOM elements' properties.
- `removeClass(className)`: removes the specified `className` from the DOM elements' properties.
- `attr(attribute, value)`: will either return the value of the `attribute` if the function is not provided
a value, otherwise, it sets the value of the provided `attribute` to `value`.
- `children()`: returns all of the selected DOM element's nested DOM elements as a `DOMNodeCollection`.
- `parent()`: returns the parent DOM element or elements as a `DOMNodeCollection`.
- `remove()`: deletes the DOM element from the page.
- `find(selector)`: returns nested DOM elements that meet the `selector` criteria.
- `html(textContent)`: if provided `textContent` it will set the HTML content, otherwise it returns the
HTML content inside of the element.
- `on(event, callback)`: places an event listener on the DOM element with the specified callback
- `off(event)`: removes the specified event listener on the DOM element

##### Extends

`$a.extend` is a simple function that will return the result of merging multiple JavaScript objects.

##### Ajax

aDOMinableSnowman also comes implements an Ajax function, `$a.ajax(options)`. Default options are provided,
but by using $a.extend, it allows aDOMinableSnowman to pass in optional arguments as well.

```javascript
$a.ajax = options => {
  const xhr = new XMLHttpRequest();
  options = $a.extend(defaultOptions, options);
  options.method = options.method.toUpperCase();

  if (options.method === "GET"){
    options.url += "?" + toQueryString(options.data);
  }

  xhr.open(options.method, options.url, true);
  xhr.onload = e => {
    if (xhr.status === 200) {
      options.success(xhr.response);
    } else {
      options.error(xhr.response);
    }
  };

  xhr.send(JSON.stringify(options.data));
};
```
