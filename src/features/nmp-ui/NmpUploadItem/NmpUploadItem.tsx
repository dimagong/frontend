import "./styles.scss";

import React from "react";
import type { FC, MouseEventHandler } from "react";
import { CloseCircleFilled } from "@ant-design/icons";

import { NmpButton } from "../NmpButton";
import { NpmTooltip } from "../NpmTooltip";

import fileloading from "features/members/ui/icons/FileLoading.svg";

export enum FileStatusTypes {
  Idle = "idle",
  Uploading = "uploading",
}
const image = {
  src: fileloading,
  alt: "file-onloading",
};
const icons = {
  [FileStatusTypes.Idle]: <CloseCircleFilled style={{ fontSize: 21 }} />,
  [FileStatusTypes.Uploading]: <img src={image.src} alt={image.alt} />,
};

type Props = {
  filename: string;
  isDisabled?: boolean;
  isRemovable?: boolean;
  onRemove?: MouseEventHandler<HTMLElement>;
  onDownload?: MouseEventHandler<HTMLElement>;
  progressloading?: number;
  status?: FileStatusTypes.Idle | FileStatusTypes.Uploading;
  icons?: { [key: string]: JSX.Element };
};

export const NmpUploadItem: FC<Props> = (props) => {
  const {
    filename,
    isDisabled = false,
    isRemovable = false,
    onRemove,
    onDownload,
    progressloading = 100,
    status = FileStatusTypes.Uploading,
  } = props;

  return (
    <div className="nmp-upload-item">
      <NmpButton type="text" className="nmp-upload-item__filename" disabled={isDisabled} onClick={onDownload}>
        {filename}
      </NmpButton>

      {isRemovable && status === FileStatusTypes.Idle ? (
        <div className="nmp-upload-item__status">
          <div className="nmp-upload-item__progress progress-color--idle">100%</div>
          <NpmTooltip title="Remove">
            <NmpButton
              danger
              type="text"
              shape="circle"
              icon={icons[FileStatusTypes.Idle]}
              disabled={isDisabled}
              onClick={onRemove}
            />
          </NpmTooltip>
        </div>
      ) : null}

      {status === FileStatusTypes.Uploading ? (
        <div className="nmp-upload-item__status">
          <div className="nmp-upload-item__progress progress-color--stage"> {`${progressloading}%`}</div>
          <NpmTooltip title="Uploading">
            <div className="nmp-upload-item__img">{icons[FileStatusTypes.Uploading]}</div>
          </NpmTooltip>
        </div>
      ) : null}
    </div>
  );
};
