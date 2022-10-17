export const triggerFileDownloading = (file: File) => {
  const url = URL.createObjectURL(file);
  const anchorElement = document.createElement("a");

  anchorElement.href = url;
  anchorElement.setAttribute("target", "_blank");
  anchorElement.setAttribute("download", file.name);

  anchorElement.click();
  URL.revokeObjectURL(url);
};
