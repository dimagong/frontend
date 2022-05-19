export const promisifiedReadAsDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("loadend", (event) => resolve(reader.result));
    reader.addEventListener("error", (error) => reject(error));

    reader.readAsDataURL(blob);
  });
};
