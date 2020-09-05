import React, {useEffect, useState} from "react";
import {dataURItoBlob, extractFileInfo, processFiles} from "../utils";
import {concat, isEmpty} from "lodash";
import {X} from "react-feather";
import rfdc from "rfdc";
import fileService from "../../../../../services/file.service";
import moment from "moment";
import {Badge, Spinner} from "reactstrap";

const clone = rfdc();


export function FileWidget(props) {

  let inputFileRef = React.createRef();
  const propertyKey = props.id.replace('root_', '');

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
    props.onChange(concat(files, oldValues));
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
    return <div className="d-flex">
      <div>
        <a target="_blank" href={file.url}>{file.name}</a>
      </div>
      <div className="ml-1">


        {
          Array.isArray(props.value) && filesRemoving.indexOf(props.value[index].file.id) !== -1 ?
            <span>
                <Badge color="danger">
                  removing
                </Badge>
                <Spinner color="danger" className="ml-1" size="sm"/>
            </span>
            :
            <X size={15} className="cursor-pointer" onClick={event => removeFile(event, file, index)}/>
        }
      </div>
    </div>
  };

  const renderSingleFile = (fileDataUrl) => {
    if (!fileDataUrl) return <div></div>;

    if (Array.isArray(fileDataUrl) && fileDataUrl.length) {
      fileDataUrl = fileDataUrl[0];
    }
    let file = dataURItoBlob(fileDataUrl.property_value);
    let fileUrl = window.URL.createObjectURL(
      new Blob([file.blob], {type: file.blob.type})
    );
    return renderFile({name: file.name, url: fileUrl}, 0);
  };

  const renderMultipleFile = (filesDataUrl) => {
    if (!filesDataUrl || !filesDataUrl.length) return <div></div>;

    return filesDataUrl.map((fileDataUrl, index) => {
      let file = dataURItoBlob(fileDataUrl.property_value);
      let fileUrl = window.URL.createObjectURL(
        new Blob([file.blob], {type: file.blob.type})
      );

      return renderFile({name: file.name, url: fileUrl}, index);
    })

  };

  const renderFiles = () => {


    if(this.state.loadingFiles.length) {
      let loadingFiles = this.state.loadingFiles.filter(loadingFile => {
        return loadingFile.file.group === propertyKey
      });
      console.log('this.state.loadingFiles', this.state.loadingFiles);
      return loadingFiles.map(loadingFile => {
        return <div>{loadingFile.file.name}<Spinner color="primary" className="ml-1" size="sm"/></div>;
      })
    }


    let mainFiles = props.multiple ? renderMultipleFile(props.value) : renderSingleFile(props.value);

    return <div>
      <div>
        {
          filesLoading.map((fileLoading) => {
            return <div>{dataURItoBlob(fileLoading).name} <Spinner color="primary" size="sm"/></div>;
          })
        }
      </div>
      {mainFiles}
    </div>
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

  return <div>
    <input type="file"
           ref={inputFileRef}
           multiple={props.multiple}
           required={props.required}
           disabled={props.disabled || (props.multiple ? isMultipleFileDisabled() : isSingleFileDisabled())}
           onChange={(event) => this.props.fileLoader && onChange(event)}/>
    <div className="mt-1">

      {renderFiles()}
    </div>
  </div>
};

//
// export function FileWidgetOld(props) {
//   let inputFileRef = React.createRef();
//
//   const onChangeSingle = (event) => {
//     let eventTarget = event.target;
//     processFiles(event.target.files).then((files) => {
//       if (files[0].dataURL === 'data:') {
//         eventTarget.value = null;
//         return;
//       }
//       props.onChange(files[0].dataURL);
//       setTimeout(() => {
//         eventTarget.value = null;
//       })
//     });
//   };
//   const onChangeMultiple = (event) => {
//     let eventTarget = event.target;
//     let oldFiles = clone(props.value);
//     processFiles(event.target.files).then((files) => {
//       let filesDataUrl = files.filter(file => typeof file.dataURL !== "undefined" && file.dataURL !== 'data:').map(file => file.dataURL);
//
//       let concatedFiles = concat(filesDataUrl, oldFiles);
//       props.value.splice(0, props.value.length);
//       props.value.push.apply(props.value, concatedFiles)
//       props.onChange(props.value);
//       setTimeout(() => {
//         eventTarget.value = null;
//       })
//     });
//   };
//
//   const onChange = (event) => {
//     if (props.multiple) {
//       onChangeMultiple(event);
//     } else {
//       onChangeSingle(event);
//     }
//   };
//
//   const removeFile = (event, file, index) => {
//     if (!window.confirm(`Are you sure you want to delete the file: ${file.name}`)) {
//       return;
//     }
//     if (props.multiple) {
//       if (props.value.length === 1) {
//         props.value.splice(0, props.value.length)
//         props.onChange(props.value);
//       } else {
//         let values = clone(props.value);
//         values.splice(index, 1);
//         props.onChange(values);
//       }
//     } else {
//       props.onChange(null);
//     }
//
//   };
//
//   return <div>
//     <input type="file"
//            ref={inputFileRef}
//            multiple={props.multiple}
//            required={props.required}
//            onChange={(event) => onChange(event)}/>
//     <div className="mt-1">
//       {
//         Array.isArray(props.value) ? extractFileInfo(props.value).map((file, index) => {
//           let fileUrl = '';
//           if (props.multiple && props.value[index]) {
//             fileUrl = window.URL.createObjectURL(
//               new Blob([dataURItoBlob(props.value[index]).blob], {type: file.type})
//             )
//           } else if (!props.multiple && props.value) {
//             fileUrl = window.URL.createObjectURL(
//               new Blob([dataURItoBlob(props.value).blob], {type: file.type})
//             );
//           }
//
//           return <div className="d-flex">
//             <div>
//               <a target="_blank" href={fileUrl}>{decodeURIComponent(file.name)}</a>
//             </div>
//             <div className="ml-1">
//               <X size={15} className="cursor-pointer" onClick={event => removeFile(event, file, index)}/>
//             </div>
//           </div>
//         }) : null
//       }
//     </div>
//   </div>
// };
