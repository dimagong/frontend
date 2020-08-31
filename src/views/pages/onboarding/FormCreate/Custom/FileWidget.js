import React from "react";
import {dataURItoBlob, extractFileInfo, processFiles} from "../utils";
import {concat} from "lodash";
import {X} from "react-feather";
import rfdc from "rfdc";

const clone = rfdc();


export function FileWidget(props) {
  let inputFileRef = React.createRef();

  console.log('PROPS', props);

  const onChangeSingle = (event) => {
    let eventTarget = event.target;
    console.log(event.target.files);
    processFiles(event.target.files).then((files) => {
      if (!files.length) return;
      if (files[0].dataURL === 'data:') {
        return;
      }
      props.onChange(files[0].dataURL);
      eventTarget.value = null;
    });
  };

  const onChangeMultiple = (event) => {
    let eventTarget = event.target;
    let oldFiles = clone(props.value);
    processFiles(event.target.files).then((files) => {
      let filesDataUrl = files.filter(file => typeof file.dataURL !== "undefined" && file.dataURL !== 'data:').map(file => file.dataURL);
      let concatedFiles = concat(filesDataUrl, oldFiles);
      props.onChange(concatedFiles);
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

  const removeFile = (event, file, index = null) => {
    if (!window.confirm(`Are you sure you want to delete the file: ${file.name}`)) {
      return;
    }
    if (props.multiple) {
      let newValue = clone(props.value);
      newValue.splice(index, 1);
      props.onChange(newValue);
    } else {
      props.onChange(null);
    }
  };

  const renderFile = (file, index = null) => {
    return <div className="d-flex">
      <div>
        <a target="_blank" href={file.url}>{file.name}</a>
      </div>
      <div className="ml-1">
        <X size={15} className="cursor-pointer" onClick={event => removeFile(event, file, index)}/>
      </div>
    </div>
  };

  const renderSingleFile = (fileDataUrl) => {
    if (!fileDataUrl) return <div>empty</div>;

    let file = dataURItoBlob(fileDataUrl);
    let fileUrl = window.URL.createObjectURL(
      new Blob([file.blob], {type: file.blob.type})
    );
    console.log('renderSIngleFile', file);
    return renderFile({name: file.name, url: fileUrl});
  };

  const renderMultipleFile = (filesDataUrl) => {
    if (!filesDataUrl || !filesDataUrl.length) return <div>empty</div>;

    return filesDataUrl.map((fileDataUrl, index) => {
      let file = dataURItoBlob(fileDataUrl);
      let fileUrl = window.URL.createObjectURL(
        new Blob([file.blob], {type: file.blob.type})
      );

      return renderFile({name: file.name, url: fileUrl}, index);
    })

  };

  const renderFiles = () => {
    return props.multiple ? renderMultipleFile(props.value) : renderSingleFile(props.value)
  };

  return <div>
    <input type="file"
           ref={inputFileRef}
           multiple={props.multiple}
           required={props.required}
           onChange={(event) => onChange(event)}/>
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
