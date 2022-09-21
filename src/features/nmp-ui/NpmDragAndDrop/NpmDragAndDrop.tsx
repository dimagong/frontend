import "./styles.scss";

import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import React from "react";
import { PlusCircleFilled } from "@ant-design/icons";
import { BuiltInParserName } from "prettier";

const { Dragger } = Upload;

interface IProps {
  name?: string;
  multiple?: boolean;
  action?: string;
  beforeUpload?: () => boolean;
  customRequest?: () => any;
  showUploadList?: boolean;
  onDownload?: (file) => any;
  onChange?: (e: any) => any;
  onDrop?: (e: any) => any;
  disabled?: boolean;
}

// const props: UploadProps = {
//   name: "file",
//   multiple: true,
//   action: "",
//   beforeUpload: () => false,
//   customRequest: () => {},
//   showUploadList: false,
//   onDownload(file) {
//     console.log("UploadProps file", file);
//   },
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//     if (status === "done") {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer.files);
//   },
// };

const NpmDragAndDrop: React.FC<IProps> = (props: IProps) => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <PlusCircleFilled style={{ color: "#F4F4F4", backgroundColor: "#A8A8A8", borderRadius: 50 }} />
    </p>
    <p className="ant-upload-text text-style">Drag and drop or</p>
    <p className=" text-style">Browse to choose a file</p>
  </Dragger>
);

export default NpmDragAndDrop;
