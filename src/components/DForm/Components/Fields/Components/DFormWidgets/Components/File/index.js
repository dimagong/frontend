import "./style.scss";

import React, { useRef, useState } from "react";

import { useDFormContext } from "components/DForm/DFormContext";

import { useCreateMVAUserFilesMutation } from "api/Onboarding/prospectUserQuery";
import { useCreateApplicationUserFilesMutation } from "features/user-managment/userEdit/userQueries";

import FieldLabel from "../FieldLabel";

import { FilesPreview } from "./FilesPreview";
import { MemberFilePreview } from "./MemberFilePreview";
import { ManagerFilePreview } from "./ManagerFilePreview";

const multiple = false;

const File = (props) => {
  const { dFormId, isMemberView } = useDFormContext();

  const files = props.value;
  const masterSchemaFieldId = props.masterSchemaPropertyId;

  const [uploadingFiles, setUploadingFiles] = useState([]);
  // In next update it will be refactored with DI as Network API provider which will provide
  // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
  // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
  // when it is used in another scope that provide Network it will use it correspondingly.
  const useCreateUserFilesMutation = isMemberView
    ? useCreateMVAUserFilesMutation
    : useCreateApplicationUserFilesMutation;
  const params = { dFormId, masterSchemaFieldId };
  const createUserFilesMutation = useCreateUserFilesMutation(params, {
    onError: () => setUploadingFiles([]),
    onSuccess: () => setUploadingFiles([]),
  });

  const inputFileRef = useRef();

  const onInputFileChange = (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();

    formData.append("master_schema_field_id", props.masterSchemaPropertyId);

    const uploadingFiles = [];
    files.forEach((file, idx) => {
      uploadingFiles.push({ name: file.name });
      formData.append(`files[${idx}]`, file, file.name);
    });

    setUploadingFiles(uploadingFiles);
    createUserFilesMutation.mutate(formData);
  };

  const onDropZoneClick = () => {
    const inputFileElement = inputFileRef.current;

    if (inputFileElement && inputFileElement instanceof HTMLInputElement) {
      // Trigger click event on input element - leads to open browser's file manager.
      // User can close browser's file manager or select file/files.
      inputFileElement.click();
    }
  };

  /* Old code */

  // const clone = rfdc();
  // const propertyKey = props.id.replace("root_", "");
  // const deletedFiles = useRef([]);
  // const inputFileRef = useRef(null);
  // let [filesLoading, setFilesLoading] = useState([]);
  // let [filesRemoving, setFilesRemoving] = useState([]);

  // const sendFile = async (dataUrl) => {
  //   let indexLoadingFile = filesLoading.length;
  //   setFilesLoading(filesLoading.concat(dataUrl));
  //   const response = await fileService.sendFile(this.state.dFormTemplate.id, [dataUrl], propertyKey);
  //   let file = response.data.data;
  //   props.onChange(file);
  //   setFilesLoading(filesLoading.filter((fileLoading, key) => key !== indexLoadingFile));
  // };
  //
  // const sendMultiFiles = async (dataUrl, oldValues) => {
  //   let indexLoadingFile = filesLoading.length;
  //   setFilesLoading(filesLoading.concat(dataUrl));
  //   const response = await fileService.sendFile(this.state.dFormTemplate.id, dataUrl, propertyKey);
  //   let files = response.data.data;
  //   props.onChange(concat(oldValues, files));
  //   setFilesLoading(filesLoading.filter((fileLoading, key) => key !== indexLoadingFile));
  // };
  //
  // const onChangeSingle = (event) => {
  //   let eventTarget = event.target;
  //   processFiles(event.target.files).then((files) => {
  //     if (!files.length) return;
  //     if (files[0].dataURL === "data:") {
  //       return;
  //     }
  //     //props.onChange(files[0].dataURL);
  //     sendFile(files[0].dataURL);
  //     eventTarget.value = null;
  //   });
  // };
  //
  // const onChangeMultiple = (event) => {
  //   let eventTarget = event.target;
  //   let oldFiles = clone(props.value);
  //   processFiles(event.target.files).then((files) => {
  //     let filesDataUrl = files
  //       .filter((file) => typeof file.dataURL !== "undefined" && file.dataURL !== "data:")
  //       .map((file) => file.dataURL);
  //     //props.onChange(concatedFiles);
  //     sendMultiFiles(filesDataUrl, oldFiles);
  //     eventTarget.value = null;
  //   });
  // };
  //
  // const onChange = (event) => {
  //   if (props.multiple) {
  //     onChangeMultiple(event);
  //   } else {
  //     onChangeSingle(event);
  //   }
  // };
  //
  // const removeFile = async (event, file, index) => {
  //   if (!window.confirm(`Are you sure you want to delete the file: ${file.name}`)) {
  //     return;
  //   }
  //   if (props.multiple) {
  //     const { value } = props;
  //     deletedFiles.current.push(value[index].file.id);
  //
  //     let newValue = [...value].filter(({ file }) => !deletedFiles.current.includes(file.id));
  //
  //     setFilesRemoving(filesRemoving.concat(value[index].file.id));
  //     await fileService.deleteFile(value[index].file.id);
  //     setFilesRemoving(filesRemoving.filter((fileId) => fileId !== value[index].file.id));
  //     props.onChange(newValue);
  //   } else {
  //     setFilesRemoving(filesRemoving.concat(props.value[index].file.id));
  //     await fileService.deleteFile(props.value[index].file.id);
  //     setFilesRemoving(filesRemoving.filter((fileId) => fileId === props.value[index].file.id));
  //     props.onChange(null);
  //   }
  // };
  //
  // const renderFile = (file, index = null) => {
  //   const isFileRemoving = deletedFiles.current.includes(props.value[index].file.id);
  //   const isRemoving =
  //     (Array.isArray(props.value) && ~filesRemoving.indexOf(props.value[index].file.id)) || isFileRemoving;
  //
  //   return (
  //     <div className="file">
  //       <div className="name">
  //         {/* eslint-disable-next-line react/jsx-no-target-blank */}
  //         <a target="_blank" href={file.url}>
  //           {decodeURIComponent(file.name)}
  //         </a>
  //       </div>
  //
  //       <div className="actions">
  //         {!isRemoving ? (
  //           <Badge color="primary cursor-pointer ml-1 mr-1" onClick={() => downloadFile(file)}>
  //             download
  //           </Badge>
  //         ) : null}
  //         <div className="upload-progress">{isRemoving ? <Badge color="danger">removing</Badge> : <>100%</>}</div>
  //         {/*<span>*/}
  //
  //         {/*  <Spinner color="danger" className="ml-1" size="sm"/>*/}
  //         {/*</span>*/}
  //         <div>
  //           {isRemoving ? (
  //             <Spinner color="danger" className="" size="sm" />
  //           ) : props.disabled ? null : (
  //             <X size={15} className="cursor-pointer" onClick={(event) => removeFile(event, file, index)} />
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  //
  // const FileItem = ({ name }) => {
  //   return (
  //     <div className={"file"}>
  //       <div className="name">{decodeURIComponent(name)}</div>
  //       <div>
  //         <div className="upload-progress"></div>
  //         <div className="action">
  //           <Spinner color="primary" className="ml-1" size="sm" />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  //
  // const renderSingleFile = (fileDataUrl) => {
  //   if (!fileDataUrl) return <div />;
  //
  //   if (Array.isArray(fileDataUrl) && fileDataUrl.length) {
  //     fileDataUrl = fileDataUrl[0];
  //   }
  //
  //   let file;
  //   try {
  //     file = dataURItoBlob(fileDataUrl.property_value);
  //   } catch (error) {
  //     return <div />;
  //   }
  //
  //   let fileUrl = window.URL.createObjectURL(new Blob([file.blob], { type: file.blob.type }));
  //   return renderFile({ name: file.name, url: fileUrl, blob: file.blob }, 0);
  // };
  //
  // const downloadFile = (file) => {
  //   const a = document.createElement("a");
  //   document.body.appendChild(a);
  //   a.href = file.url;
  //   a.download = file.name;
  //   a.click();
  //   setTimeout(() => {
  //     window.URL.revokeObjectURL(file.url);
  //     document.body.removeChild(a);
  //   }, 0);
  // };
  //
  // const renderMultipleFile = (filesDataUrl) => {
  //   if (!filesDataUrl || !filesDataUrl.length) return <div></div>;
  //
  //   return filesDataUrl.map((fileDataUrl, index) => {
  //     if (!fileDataUrl.property_value) return <></>;
  //
  //     let file;
  //     try {
  //       file = dataURItoBlob(fileDataUrl.property_value);
  //     } catch (error) {
  //       return <></>;
  //     }
  //
  //     let fileUrl = window.URL.createObjectURL(new Blob([file.blob], { type: file.blob.type, name: "test" }));
  //
  //     return renderFile({ name: file.name, url: fileUrl }, index);
  //   });
  // };
  //
  // const renderFiles = () => {
  //   return "mocked files";
  //   if (this.state.loadingFiles.length) {
  //     let loadingFiles = this.state.loadingFiles.filter((loadingFile) => {
  //       return loadingFile.file.group === propertyKey;
  //     });
  //     return loadingFiles.map((loadingFile) => {
  //       // return <div>{loadingFile.file.name}<Spinner color="primary" className="ml-1" size="sm"/></div>;
  //       return <FileItem name={loadingFile.file.name} isLoading={true} />;
  //     });
  //   }
  //   let mainFiles = props.multiple ? renderMultipleFile(props.value) : renderSingleFile(props.value);
  //
  //   return (
  //     <>
  //       {(!props.value || !props.value.length) && props.disabled && <div>No files uploaded</div>}
  //       {mainFiles}
  //
  //       {filesLoading.map((fileLoading) => {
  //         return <FileItem name={decodeURIComponent(dataURItoBlob(fileLoading).name)} isLoading={true} />;
  //       })}
  //     </>
  //   );
  // };
  //
  // const onDragEnter = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  // };
  //
  // const onDragLeave = (event) => {
  //   event.preventDefault();
  // };
  //
  // const onDragOver = (event) => {
  //   event.preventDefault();
  // };
  //
  // const onDrop = (event) => {
  //   event.preventDefault();
  //   const files = event.dataTransfer?.files || event.target.files;
  //
  //   // migration: Make data format acceptable by all other methods
  //   const formattedFiles = [];
  //   if (props.multiple) {
  //     for (let i = 0; i < files.length; i++) {
  //       formattedFiles.push(files[i]);
  //     }
  //   } else {
  //     formattedFiles.push(files[0]);
  //   }
  //
  //   const migration = { target: { files: formattedFiles } };
  //
  //   this.props.fileLoader && onChange(migration);
  // };

  return (
    <div className="custom-form-filed form-create_custom-text-widget">
      <FieldLabel label={props.label} required={props.isRequired} />

      <FilesPreview
        files={files}
        uploadingFiles={uploadingFiles}
        masterSchemaFieldId={masterSchemaFieldId}
        // In next update it will be refactored with DI as Network API provider which will provide
        // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
        // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
        // when it is used in another scope that provide Network it will use it correspondingly.
        previewFile={(file) => {
          return isMemberView ? (
            <MemberFilePreview
              name={file.name}
              fileId={file.file_id}
              masterSchemaFieldId={masterSchemaFieldId}
              key={file.file_id}
            />
          ) : (
            <ManagerFilePreview
              name={file.name}
              fileId={file.file_id}
              masterSchemaFieldId={masterSchemaFieldId}
              key={file.file_id}
            />
          );
        }}
      />

      {/* ToDo: Hide drop zone when multiple is false and there is one file */}
      <div
        className="d-flex align-items-center justify-content-center p-1 dform-file__drop-zone"
        onClick={onDropZoneClick}
        // onDrop={onDrop}
        // onDragOver={onDragOver}
        // onDragLeave={onDragLeave}
        // onDragEnter={onDragEnter}
      >
        <span>Drag 'n' Drop files here or click to open file manager</span>

        <input
          type="file"
          multiple={multiple}
          disabled={props.disabled || createUserFilesMutation.isLoading}
          onChange={onInputFileChange}
          className="dform-file__input"
          ref={inputFileRef}
        />
      </div>
    </div>
  );
};

export default File;
