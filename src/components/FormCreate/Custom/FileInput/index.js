import React, { useState } from "react";

import "./styles.scss";

const FileInput = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("Drop");

  const handleFile = (file) => {
    const result = {};

    result.name = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      result.content = e.target.result;
      setFiles([...files, result]);
    };
    reader.readAsDataURL(file);
  };

  const onDragEnter = (event) => {
    event.preventDefault();
    setStatus("File Detected");

    // event.stopPropagation();
  };
  const onDragLeave = (event) => {
    event.preventDefault();
    setStatus("Drop Here");
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        handleFile(files[i]);
      }
    }
  };
  return (
    <div className="file-input">
      {files.map((file) => {
        return <div key={file.name}>{file.name}</div>;
      })}
      <div
        className="drop-zone"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {
          {
            // eslint-disable-next-line no-useless-escape
            Drop: "Drag 'n' Drop files here",
            "Drop Here": "come back",
            "File Detected": "COme on do IT !",
          }[status]
        }
      </div>
    </div>
  );
};

export default FileInput;
