import React from "react";
import type { FC } from "react";
import { useMutation } from "react-query";

import { NmpUpload } from "features/nmp-ui";
import { triggerFileDownloading, invariant } from "features/common";

import type { DFormFile } from "../../types";
import { DFormContext } from "../DFormContext";

type Props = {
  value?: DFormFile;
  isDisabled?: boolean;
  masterSchemaFieldId?: number;
};

export const DFormResourceItem: FC<Props> = (props) => {
  const { value, isDisabled, masterSchemaFieldId } = props;
  const filename = value ? value.custom_filename ?? value.name : "noname resource";

  const { dformId, dformFileService } = DFormContext.useContext();

  const downloadMutation = useMutation({ mutationFn: dformFileService!.get, onSuccess: triggerFileDownloading });

  const downloadFile = () => {
    const fileId = value?.file_id;

    invariant(fileId, "Can't download without 'fileId'.");
    invariant(dformId, "Can't download without 'dformId'.");
    invariant(masterSchemaFieldId, "Can't download without 'masterSchemaFieldId'.");

    downloadMutation.mutate({ masterSchemaFieldId, dformId, fileId });
  };

  return <NmpUpload.Item filename={filename} isDisabled={isDisabled} onDownload={downloadFile} />;
};
