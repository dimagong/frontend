import masterSchemaApi from "api/masterSchema/masterSchema";

const downloadBLobAsCsv = (blob, filename) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0)
  }
};

const downloadBlob = (blob, name) => {
  if (
    window.navigator &&
    window.navigator.msSaveOrOpenBlob
  ) return window.navigator.msSaveOrOpenBlob(blob);

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = data;
  link.download = name;

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
};

// In case if user_id in undefined, you get MS data for whole organization for all users
const handleMasterSchemaDataExport = async (targetName, organization_type, organization_id, user_id) => {
  const masterSchemaDataBlob = await masterSchemaApi.getMasterSchemaCsv({
    organization_type,
    organization_id,
    user_id,
  });

  downloadBLobAsCsv(
    masterSchemaDataBlob,
    encodeURI( `${targetName}'s master schema data`).replace(/%20/g, " ")
  );
};

export {
  downloadBLobAsCsv,
  handleMasterSchemaDataExport,
  downloadBlob,
}
