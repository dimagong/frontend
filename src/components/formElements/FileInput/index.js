import React, { useState, useRef } from 'react'
import { toast } from "react-toastify"
import {Trash2} from 'react-feather'

import './styles.scss'

const dropZoneStatus = {
  ready: "Drag and Drop or click to open file manager",
  drop: "Drop here",
}

const FileInput = ({multiple = false, acceptTypes, value, onChange, loading, preview}) => {

  const inputFileRef = useRef( null );
  const [status, setStatus] = useState(dropZoneStatus.ready)
  const [, setIsDropZoneVisible] = useState(value === null)

  const onDragEnter = event => {
    event.preventDefault();
    event.stopPropagation();

    setStatus(dropZoneStatus.drop)

  }
  const onDragLeave = event => {
    event.preventDefault();
    setStatus(dropZoneStatus.ready)
  }

  const onDragOver = event => {
    event.preventDefault();
  }

  const checkFormats = (files) => {
    for (let i = 0; i < files.length; i++) {
      if(!acceptTypes.includes(files[0].type)) {
        const acceptableTypes = acceptTypes.reduce((acc, type) => { return `${acc} ${type.split("/")[1]}`}, "")
        toast.error(`Wrong file type, please use ${acceptableTypes}`)
        return false
      }
    }

    return true;
  }

  const handleFiles = event => {
    event.preventDefault();

    setStatus(dropZoneStatus.ready)
    const files = event.dataTransfer?.files || event.target.files;

    const isValid = checkFormats(files)
    if(!isValid) return;

    if (!multiple) {
      onChange(files[0])
      setIsDropZoneVisible(false)
    }
  }

  const openFileManager = () => {
    inputFileRef.current.click();
  }

  const removeFile = () => {
    if (!multiple) {
      onChange(null)
      setIsDropZoneVisible(true)
    }
  }

  if (loading) {
    return (
      <div className={"form-element_file-input"}>
        <div className={"form-element_file-input_drop-zone"}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className={"form-element_file-input"}>
      {/* eslint-disable-next-line no-mixed-operators */}
      {value && (
        <div className={"form-element_file-input_drop-zone"}>
          {/* eslint-disable-next-line no-mixed-operators */}
          {!multiple && (
            preview ? (
              <>
                <img className={"form-element_file-input_drop-zone_preview-img"} src={preview} alt={`${value?.name} company logo`}/>
                <div className={"form-element_file-input_delete-icon"}>
                  <Trash2 onClick={removeFile} size={18} />
                </div>
              </>
            ) : (
              <>
                <div>{value?.name}</div>
                <div className={"form-element_file-input_delete-icon"}>
                  <Trash2 onClick={removeFile} size={18} />
                </div>
              </>
            )
            // eslint-disable-next-line no-mixed-operators
          ) || (
            <div />
          )}
        </div>
        // eslint-disable-next-line no-mixed-operators
      ) || (
        <div
          className="form-element_file-input_drop-zone"
          onClick={openFileManager}
          onDrop={handleFiles}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
        >
          {status}

          <input className={"form-element_file-input_hidden-input-file"}
                 onChange={handleFiles}
                 type="file"
                 ref={inputFileRef}
          />
        </div>
      )}
    </div>
  )
}

export default FileInput;
