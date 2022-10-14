import "./styles.scss";

import React from "react";
import type { FC, MouseEventHandler } from "react";
import { CloseCircleFilled } from "@ant-design/icons";

import { NpmButton } from "../NpmButton";
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
      <NpmButton type="text" block className="nmp-upload-item__filename" disabled={isDisabled} onClick={onDownload}>
        {filename}
      </NpmButton>

      {isRemovable ? (
        <NpmTooltip title="Remove">
          <NpmButton
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
