import React, {useState} from 'react';

import './styles.scss'

const FileInput = ({multiple}) => {

  const [files, setFiles] = useState([])
  const [status, setStatus] = useState("Drop")

  const handleFile = (file) => {
    console.log(file)
    const result = {};

    result.name = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      result.content = e.target.result;
      setFiles([...files, result])
    }
    reader.readAsDataURL(file);
  }

  const onDragEnter = event => {
    event.preventDefault();
    setStatus('File Detected');
    console.log("detected")

    // event.stopPropagation();
  }
  const onDragLeave = event => {
    event.preventDefault();
    setStatus('Drop Here');
    console.log("drop here")
  }

  const onDragOver = event => {
    event.preventDefault();
  }

  const onDrop = event => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        handleFile(files[i])
      }
    }
  }
  console.log(files)
  return (
    <div className="file-input">
      {files.map((file) => {
        return (
          <div key={file.name}>{file.name}</div>
        )
      })}
      <div className="drop-zone" onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}>
        {{
          'Drop': "Drag \'n\' Drop files here",
          'Drop Here': "come back",
          'File Detected': "COme on do IT !"
        }[status]}
      </div>
    </div>
  )
}

export default FileInput;
