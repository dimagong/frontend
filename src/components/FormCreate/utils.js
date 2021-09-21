import * as _ from 'lodash'
import { Base64 } from 'js-base64';

export function dataURItoBlob(dataURI) {



  try {
    // Split metadata from data
    var splitted = dataURI.split(","); // Split params

    var params = splitted[0].split(";"); // Get mime-type from params

    var type = params[0].replace("data:", ""); // Filter the name property from params

    var properties = params.filter(function (param) {
      return param.split("=")[0] === "name";
    }); // Look for the name and use unknown if no name property.

    var name;

    if (properties.length !== 1) {
      name = "unknown";
    } else {
      // Because we filtered out the other property,
      // we only have the name case here.
      name = properties[0].split("=")[1];
    } // Built the Uint8Array Blob parameter from the base64 string.


    var binary = Base64.atob((splitted[1]));
    var array = [];

    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    } // Create the blob object

    var blob = new window.Blob([new Uint8Array(array)], {
      type: type
    });

  } catch (e) {
    throw new Error(e)
  }

  return {
    blob: blob,
    name: name
  };
}

export function addNameToDataURL(dataURL, name) {
  return dataURL.replace(";base64", ";name=".concat(encodeURIComponent(name), ";base64"));
}

export function processFile(file) {
  var name = file.name,
    size = file.size,
    type = file.type;
  return new Promise(function (resolve, reject) {
    var reader = new window.FileReader();
    reader.onerror = reject;

    reader.onload = function (event) {
      resolve({
        dataURL: addNameToDataURL(event.target.result, name),
        name: name,
        size: size,
        type: type
      });
    };

    reader.readAsDataURL(file);
  });
}

export function processFiles(files) {
  return Promise.all([].map.call(files, processFile));
}

export function getFile(file, callback) {
  var reader  = new FileReader();
  reader.onloadend = (...args) => {
    callback && callback(reader);
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}

export function extractFileInfo(dataURLs) {
  return dataURLs.filter(function (dataURL) {
    return typeof dataURL !== "undefined" && dataURL !== 'data:';
  }).map(function (dataURL) {
    var _dataURItoBlob = dataURItoBlob(dataURL),
      blob = _dataURItoBlob.blob,
      name = _dataURItoBlob.name;

    return {
      name: name,
      size: blob.size,
      type: blob.type
    };
  });
}
export function deepCompare() {
  var i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof (x[p])) {
        case 'object':
        case 'function':

          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
}

export function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
