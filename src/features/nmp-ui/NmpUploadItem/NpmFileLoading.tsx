import React, { FC } from "react";
import { ArrowUpOutlined, CloseCircleFilled } from "@ant-design/icons";

import { NpmTooltip, NpmButton, NpmProgress } from "features/nmp-ui";

enum FileStatusTypes {
  Idle = "idle",
  Removing = "removing",
  Uploading = "uploading",
  Downloading = "downloading",
}

const getFileStatus = ({ removing, uploading, downloading }) => {
  const truth = [
    [FileStatusTypes.Removing, removing],
    [FileStatusTypes.Uploading, uploading],
    [FileStatusTypes.Downloading, downloading],
  ].filter(([, bool]) => bool === true);

  if (truth.length === 0) {
    return FileStatusTypes.Idle;
  }

  // It should be impossible to get two or more processes at one time.
  if (truth.length > 1) {
    throw new Error(
      `Unexpected: NmpFileLoading's status can not be uploading, or downloading, or removing at one time.`
    );
  }

  return truth[0][0];
};

type Props = {
  name?: string;

  removing?: boolean;
  removable?: boolean;
  uploading?: boolean;
  downloading?: boolean;

  onRemove?: () => void;
  onDownload?: () => void;
};

const NpmFileLoading: FC<Props> = (props) => {
  const {
    name = "",
    removable = true,
    removing = false,
    uploading = false,
    downloading = false,
    onRemove,
    onDownload,
  } = props;

  const status = getFileStatus({ removing, uploading, downloading });
  const color = status === FileStatusTypes.Removing ? "#ff4d4f" : "#35A046";

  return (
    <div className="npm-fileLoading">
      <NpmButton type="text" block className="npm-fileLoading_file-name" onClick={onDownload}>
        {name}
      </NpmButton>

      {status === FileStatusTypes.Idle && removable ? (
        <NpmTooltip title="Remove">
          <NpmButton danger type="text" shape="circle" icon={<CloseCircleFilled />} onClick={onRemove} />
        </NpmTooltip>
      ) : null}

      {status !== FileStatusTypes.Idle ? (
        <NpmProgress
          width={25}
          percent={100}
          strokeWidth={15}
          strokeColor={color}
          format={() => <ArrowUpOutlined style={{ color }} />}
        />
      ) : null}
    </div>
  );
};

export default NpmFileLoading;
