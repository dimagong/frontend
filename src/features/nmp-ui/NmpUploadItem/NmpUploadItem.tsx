import "./styles.scss";

import React from "react";
import type { FC, MouseEventHandler } from "react";
import { CloseCircleFilled } from "@ant-design/icons";

import { NmpButton } from "../NmpButton";
import { NpmTooltip } from "../NpmTooltip";

import { NmpFileLoadingIcon } from "../icons";

export enum FileStatusTypes {
  Done = "done",
  Uploading = "uploading",
}

export type NmpUploadItemProps = {
  filename: string;
  isDisabled?: boolean;
  isRemovable?: boolean;
  onRemove?: MouseEventHandler<HTMLElement>;
  onDownload?: MouseEventHandler<HTMLElement>;
  percent?: number;
  status?: FileStatusTypes.Done | FileStatusTypes.Uploading;
};

export const NmpUploadItem: FC<NmpUploadItemProps> = (props) => {
  const {
    filename,
    isDisabled = false,
    isRemovable = false,
    onRemove,
    onDownload,
    status = FileStatusTypes.Done,
    percent,
  } = props;

  return (
    <div className="nmp-upload-item">
      <NmpButton type="text" block className="nmp-upload-item__filename" disabled={isDisabled} onClick={onDownload}>
        {filename}
      </NmpButton>

      <div className="nmp-upload-item__status">
        {percent ? <div className="nmp-upload-item__progress progress-color--stage"> {`${percent}%`}</div> : null}

        {status === FileStatusTypes.Uploading ? (
          <NpmTooltip title="Uploading">
            <span className="nmp-upload-item__status-icon">
              <NmpFileLoadingIcon style={{ fontSize: 21, color: "#35A046" }} />
            </span>
          </NpmTooltip>
        ) : null}

        {isRemovable && status === FileStatusTypes.Done ? (
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
        ) : null}
      </div>
    </div>
  );
};
