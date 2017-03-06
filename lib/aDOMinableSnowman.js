/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DomNodeCollection = __webpack_require__(1);
	
	const callbackFuncs = [];
	let ready = false;
	
	const $a = arg => {
	  switch(typeof(arg)){
	    case "function":
	    return registerCallback(arg);
	    case "string":
	    return getNodesFromDom(arg);
	    case "object":
	    if(arg instanceof HTMLElement){
	      return new DomNodeCollection([arg]);
	    }
	  }
	};
	
	const defaultOptions = {
	  method: "GET",
	  url: "",
	  dataType: 'json',
	  success: () => {},
	  error: () => {},
	  data: {},
	};
	
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
	
	$a.extend = (base, ...otherObjects) => {
	  otherObjects.forEach( currObject => {
	    Object.getOwnPropertyNames(currObject).forEach( key => {
	      base[key] = currObject[key];
	    });
	  });
	
	  return base;
	};
	
	const getNodesFromDom = selector => {
	  const nodes = document.querySelectorAll(selector);
	  const nodesArray = Array.from(nodes);
	  return new DomNodeCollection(nodesArray);
	};
	
	const registerCallback = func => {
	  if(!ready){
	    callbackFuncs.push(func);
	  } else {
	    func();
	  }
	};
	
	const toQueryString = obj => {
	  let result = "";
	  Object.getOwnPropertyNames(obj).forEach(key => {
	      result += key + "=" + obj[key] + "&";
	    }
	  );
	  return result.substring(0, result.length - 1);
	};
	
	document.addEventListener('DOMContentLoaded', () => {
	  ready = true;
	  callbackFuncs.forEach( func => func() );
	});
	
	window.$a = $a;


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=aDOMinableSnowman.js.map