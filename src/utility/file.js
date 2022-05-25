export const readBlobAsDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("loadend", (event) => resolve(reader.result));
    reader.addEventListener("error", (error) => reject(error));

    try {
      reader.readAsDataURL(blob);
    } catch (error) {
      reject(error);
    }
  });
};

export const blobToFile = (blob, filename) => {
  const metadata = { type: blob.type };
  const file = new File([blob], filename, metadata);

  return file;
};

export const fileToBlob = (file) =>
  file.arrayBuffer().then((arrayBuffer) => new Blob([new Uint8Array(arrayBuffer)], { type: file.type }));
