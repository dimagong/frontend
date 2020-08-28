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


    var binary = atob(splitted[1]);
    var array = [];

    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    } // Create the blob object


    var blob = new window.Blob([new Uint8Array(array)], {
      type: type
    });

  } catch (e) {
    throw new Error("Empty file")
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
