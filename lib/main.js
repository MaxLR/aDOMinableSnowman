const DomNodeCollection = require("./dom_node_collection");

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
