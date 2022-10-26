import "./styles.scss";

import React from "react";
import type { FC, MouseEventHandler } from "react";
import { CloseCircleFilled } from "@ant-design/icons";

import { NmpButton } from "../NmpButton";
import { NpmTooltip } from "../NpmTooltip";

import fileloading from "features/members/ui/icons/FileLoading.svg";

export enum FileStatusTypes {
  Uploading = "uploading",
  Error = "error",
  Success = "success",
  Done = "done",
  Removed = "removed",
}

type Props = {
  filename: string;
  isDisabled?: boolean;
  isRemovable?: boolean;
  onRemove?: MouseEventHandler<HTMLElement>;
  onDownload?: MouseEventHandler<HTMLElement>;
  percent?: number;
  status?:
    | FileStatusTypes.Uploading
    | FileStatusTypes.Error
    | FileStatusTypes.Success
    | FileStatusTypes.Done
    | FileStatusTypes.Removed;
};

export const NmpUploadItem: FC<Props> = (props) => {
  const {
    filename,
    isDisabled = false,
    isRemovable = false,
    onRemove,
    onDownload,
    status = FileStatusTypes.Done,
    percent = 100,
  } = props;
  console.log("filename", filename);
  console.log("isRemovable", isRemovable);
  console.log("status", status);
  console.log("percent", percent);

  return (
    <div className="nmp-upload-item">
      <NmpButton type="text" className="nmp-upload-item__filename" disabled={isDisabled} onClick={onDownload}>
        {filename}
      </NmpButton>

      {isRemovable && status === FileStatusTypes.Done ? (
        <div className="nmp-upload-item__status">
          <div className="nmp-upload-item__progress progress-color--idle">{`100%`}</div>
          <NpmTooltip title="Remove">
            <NmpButton
              danger
              type="text"
              shape="circle"
              icon={<CloseCircleFilled style={{ fontSize: 21 }} />}
              disabled={isDisabled}
              onClick={onRemove}
            />
          </NpmTooltip>
        </div>
      ) : null}

      {status === FileStatusTypes.Uploading ? (
        <div className="nmp-upload-item__status">
          <div className="nmp-upload-item__progress progress-color--stage"> {`${percent}%`}</div>
          <NpmTooltip title="Uploading">
            <div className="nmp-upload-item__img">
              <img src={fileloading} alt="file-onloading" />
            </div>
          </NpmTooltip>
        </div>
      ) : null}
    </div>
  );
};
