import "./styles.scss";

import React from "react";
import { Upload } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

const { Dragger } = Upload;

interface IProps {
  name?: string;
  action?: string;
  multiple?: boolean;
  disabled?: boolean;
  showUploadList?: boolean;

  customRequest?: () => any;
  beforeUpload?: () => boolean;

  onDrop?: (e: any) => any;
  onChange?: (e: any) => any;
  onDownload?: (file) => any;
}

export const NpmDragAndDrop: React.FC<IProps> = (props: IProps) => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <PlusCircleFilled style={{ color: "#F4F4F4", backgroundColor: "#A8A8A8", borderRadius: 50 }} />
    </p>
    <p className="ant-upload-text text-style">Drag and drop or</p>
    <p className=" text-style">Browse to choose a file</p>
  </Dragger>
);
