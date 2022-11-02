import "./styles.scss";

import React from "react";
import { Upload } from "antd";
import type { FC } from "react";
import classnames from "classnames";
import type { DraggerProps } from "antd/lib/upload";
import { PlusCircleFilled } from "@ant-design/icons";

import { NmpUploadItem } from "../NmpUploadItem";

const { Dragger } = Upload;

type Props = Omit<DraggerProps, "disabled" | "multiple"> & {
  isDisabled?: DraggerProps["disabled"];
  isMultiple?: DraggerProps["multiple"];
  isRemovable?: boolean;
};

type _FC = FC<Props> & { Item: typeof NmpUploadItem };

export const NmpUpload: _FC = (props) => {
  const { isRemovable = false, isDisabled, isMultiple, itemRender, fileList, ...rest } = props;

  const defaultItemRender: DraggerProps["itemRender"] = (_, file, fileList, { download, remove }) => {
    return <NmpUploadItem filename={file.name} isRemovable={isRemovable} onRemove={remove} onDownload={download} />;
  };

  return (
    <div className={classnames("nmp-upload", { "nmp-upload--empty": !fileList?.length })}>
      <Dragger
        fileList={fileList}
        disabled={isDisabled}
        multiple={isMultiple}
        itemRender={itemRender ?? defaultItemRender}
        {...rest}
      >
        <p className="ant-upload-drag-icon">
          <PlusCircleFilled style={{ color: "#F4F4F4", backgroundColor: "#A8A8A8", borderRadius: 50 }} />
        </p>
        <p className="nmp-upload__text">Drag and drop or</p>
        <p className="nmp-upload__text">
          <span>Browse</span> to choose a file
        </p>
      </Dragger>
    </div>
  );
};

NmpUpload.Item = NmpUploadItem;
