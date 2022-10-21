import "./styles.scss";

import React from "react";
import type { FC, MouseEventHandler } from "react";
import { CloseCircleFilled } from "@ant-design/icons";

import { NmpButton } from "../NmpButton";
import { NpmTooltip } from "../NpmTooltip";

type Props = {
  filename: string;
  isDisabled?: boolean;
  isRemovable?: boolean;
  onRemove?: MouseEventHandler<HTMLElement>;
  onDownload?: MouseEventHandler<HTMLElement>;
};

export const NmpUploadItem: FC<Props> = (props) => {
  const { filename, isDisabled = false, isRemovable = false, onRemove, onDownload } = props;

  return (
    <div className="nmp-upload-item">
      <NmpButton type="text" block className="nmp-upload-item__filename" disabled={isDisabled} onClick={onDownload}>
        {filename}
      </NmpButton>

      {isRemovable ? (
        <NpmTooltip title="Remove">
          <NmpButton
            danger
            type="text"
            shape="circle"
            icon={<CloseCircleFilled />}
            disabled={isDisabled}
            onClick={onRemove}
          />
        </NpmTooltip>
      ) : null}
    </div>
  );
};
