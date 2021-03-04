import React, {useEffect, useRef, useState} from "react";
import {dataURItoBlob, extractFileInfo, processFiles} from "../utils";
import {concat, isEmpty} from "lodash";
import {X} from "react-feather";
import rfdc from "rfdc";
import fileService from "../services/file.service";
import moment from "moment";
import {Badge, Spinner} from "reactstrap";

import FieldLabel from './FieldLabel';

import './fileWidget.scss'

const clone = rfdc();


export function FileWidget(props) {

  const propertyKey = props.id.replace('root_', '');
  const inputFileRef = useRef( null );
  let [filesLoading, setFilesLoading] = useState([]);
  let [filesRemoving, setFilesRemoving] = useState([]);

  const sendFile = async (dataUrl) => {
    let indexLoadingFile = filesLoading.length;
    setFilesLoading(filesLoading.concat(dataUrl));
    const response = await fileService.sendFile(this.state.dFormTemplate.id, [dataUrl], propertyKey);
    let file = response.data.data;
    props.onChange(file);
    setFilesLoading(filesLoading.filter((fileLoading, key) => key !== indexLoadingFile));
  };

  const sendMultiFiles = async (dataUrl, oldValues) => {
    let indexLoadingFile = filesLoading.length;
    setFilesLoading(filesLoading.concat(dataUrl));
    const response = await fileService.sendFile(this.state.dFormTemplate.id, dataUrl, propertyKey);
    let files = response.data.data;
    props.onChange(concat(oldValues, files));
    setFilesLoading(filesLoading.filter((fileLoading, key) => key !== indexLoadingFile));
  };

  const onChangeSingle = (event) => {
    let eventTarget = event.target;
    processFiles(event.target.files).then((files) => {
      if (!files.length) return;
      if (files[0].dataURL === 'data:') {
        return;
      }
      //props.onChange(files[0].dataURL);
      sendFile(files[0].dataURL);
      eventTarget.value = null;
    });
  };

  const onChangeMultiple = (event) => {
    let eventTarget = event.target;
    let oldFiles = clone(props.value);
    processFiles(event.target.files).then((files) => {
      let filesDataUrl = files.filter(file => typeof file.dataURL !== "undefined" && file.dataURL !== 'data:').map(file => file.dataURL);
      //props.onChange(concatedFiles);
      sendMultiFiles(filesDataUrl, oldFiles);
      eventTarget.value = null;
    });
  };

  const onChange = (event) => {
    if (props.multiple) {
      onChangeMultiple(event);
    } else {
      onChangeSingle(event);
    }
  };

  const removeFile = async (event, file, index) => {
    if (!window.confirm(`Are you sure you want to delete the file: ${file.name}`)) {
      return;
    }
    if (props.multiple) {
      let newValue = clone(props.value);
      newValue.splice(index, 1);
      setFilesRemoving(filesRemoving.concat(props.value[index].file.id));
      await fileService.deleteFile(props.value[index].file.id);
      setFilesRemoving(filesRemoving.filter(fileId => fileId === props.value[index].file.id));
      props.onChange(newValue);
    } else {
      setFilesRemoving(filesRemoving.concat(props.value[index].file.id));
      await fileService.deleteFile(props.value[index].file.id);
      setFilesRemoving(filesRemoving.filter(fileId => fileId === props.value[index].file.id));
      props.onChange(null);
    }
  };

  const renderFile = (file, index = null) => {

    const isRemoving = Array.isArray(props.value) && ~filesRemoving.indexOf(props.value[index].file.id);
    return (
      <div className="file">
        <div className="name">
          <a target="_blank" href={file.url}>{decodeURIComponent(file.name)}</a>
        </div>

        <div className="actions">
          {
            !isRemoving ? <Badge color="primary cursor-pointer ml-1 mr-1" onClick={() => downloadFile(file)} >
              download
            </Badge> : null
          }
          <div className="upload-progress">
            {isRemoving ? (
              <Badge color="danger">
                removing
              </Badge>
            ) : (
              <>100%</>
            )}
          </div>
          {/*<span>*/}

          {/*  <Spinner color="danger" className="ml-1" size="sm"/>*/}
          {/*</span>*/}
          <div>
            {
              isRemoving ? (
                <Spinner color="danger" className="" size="sm"/>
              ) : (
                props.disabled ? null
                  : <X size={15} className="cursor-pointer" onClick={event => removeFile(event, file, index)}/>
              )
            }
          </div>

        </div>
      </div>
    )
  };

  const FileItem = ({name, isLoading}) => {

    return (
      <div className={"file"}>
        <div className="name">
          {decodeURIComponent(name)}
        </div>
        <div>
          <div className="upload-progress">

          </div>
          <div className="action">
            <Spinner color="primary" className="ml-1" size="sm"/>
          </div>
        </div>
      </div>
    )
  }

  const renderSingleFile = (fileDataUrl) => {
    if (!fileDataUrl) return <div></div>;

    if (Array.isArray(fileDataUrl) && fileDataUrl.length) {
      fileDataUrl = fileDataUrl[0];
    }
    let file = dataURItoBlob(fileDataUrl.property_value);
    let fileUrl = window.URL.createObjectURL(
      new Blob([file.blob], {type: file.blob.type})
    );
    return renderFile({name: file.name, url: fileUrl, blob: file.blob}, 0);
  };

  const downloadFile = (file) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = file.url;
    a.download = file.name;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(file.url);
      document.body.removeChild(a);
    }, 0)
  };

  const renderMultipleFile = (filesDataUrl) => {
    if (!filesDataUrl || !filesDataUrl.length) return <div></div>;

    return filesDataUrl.map((fileDataUrl, index) => {
      if(!fileDataUrl.property_value) return <></>
      let file = dataURItoBlob(fileDataUrl.property_value);
      let fileUrl = window.URL.createObjectURL(
        new Blob([file.blob], {type: file.blob.type, name: 'test'})
      );

      return renderFile({name: file.name, url: fileUrl}, index);
    })

  };

  const renderFiles = () => {
    if(this.state.loadingFiles.length) {
      let loadingFiles = this.state.loadingFiles.filter(loadingFile => {
        return loadingFile.file.group === propertyKey
      });
      return loadingFiles.map(loadingFile => {
        // return <div>{loadingFile.file.name}<Spinner color="primary" className="ml-1" size="sm"/></div>;
        return <FileItem name={loadingFile.file.name} isLoading={true} />
      })
    }
    let mainFiles = props.multiple ? renderMultipleFile(props.value) : renderSingleFile(props.value);

    return <>
      {(!props.value || !props.value.length) && props.disabled && (<div>No files uploaded</div>)}
      {mainFiles}

      {
        filesLoading.map((fileLoading) => {
          return <FileItem name={decodeURIComponent(dataURItoBlob(fileLoading).name)} isLoading={true} />
        })
      }
    </>
  };

  let isSingleFileDisabled = () => {
    if (filesLoading.length) return true;
    if (!props.value) return false;
    return props.value.length;
  };
  let isMultipleFileDisabled = () => {
    if (filesLoading.length) return true;
    return false;
  };


  const onDragEnter = event => {
    event.preventDefault();
    event.stopPropagation();
  }
  const onDragLeave = event => {
    event.preventDefault();
  }

  const onDragOver = event => {
    event.preventDefault();
  }

  const onDrop = event => {
    event.preventDefault();
    const files = event.dataTransfer?.files || event.target.files;

    // migration: Make data format acceptable by all other methods
    const formattedFiles = [];
    if (props.multiple) {
      for (let i = 0; i < files.length; i++) {
        formattedFiles.push(files[i])
      }
    } else {
      formattedFiles.push(files[0])
    }


    const migration = {target: {files: formattedFiles}}


    this.props.fileLoader && onChange(migration)
  }

  const openFileManager = () => {
    inputFileRef.current.click();
  }


  const isDropZoneVisible = props.multiple ? true : (props.value && props.value.length) || this.state.loadingFiles?.length ? false : true;

  return (
    <div>
      <FieldLabel label={props.schema.title} required={props.required}/>

      <div className="rendered-files">
        {renderFiles()}
      </div>
      <div className="file-input">
        {isDropZoneVisible && !props.disabled && (
          <div className="drop-zone" onClick={openFileManager} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} onDragEnter={onDragEnter}>
            Drag 'n' Drop files here or click to open file manager

            <input className={"form-element_file-input_hidden-input-file"}
                   onChange={onDrop}
                   type="file"
                   multiple={!!props.multiple}
                   ref={inputFileRef}
            />
          </div>
        )}
      </div>
    </div>
  )
}
