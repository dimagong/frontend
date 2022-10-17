import React from "react";
import type { FC } from "react";
import { useMutation } from "react-query";

import { NmpUpload } from "features/nmp-ui";
import { triggerFileDownloading, warning } from "features/common";

import { useDFormContext } from "components/DForm/DFormContext";
import type { DFormFile } from "components/DForm/types/dformFile";
import type { GetDFormFileParams } from "components/DForm/data/dformFileService";

type Props = {
  value?: DFormFile;
  isDisabled?: boolean;
  masterSchemaFieldId: number;
};

export const DFormResourceItem: FC<Props> = (props) => {
  const { value, isDisabled, masterSchemaFieldId } = props;

  const { dformId, dformFileService } = useDFormContext();

  const downloadMutation = useMutation({
    mutationFn: (d: GetDFormFileParams) => dformFileService!.get(d),
    onSuccess: (fetchedFile) => triggerFileDownloading(fetchedFile),
  });

  const filename = value ? value.custom_filename : "unknown resource";

  const downloadFile = () => {
    const fileId = value?.file_id;

    if (!fileId) {
      warning("Unexpected: The <DFormResourceItem /> do not download a resource without 'fileId'.");
      return;
    }

    if (!dformId) {
      warning("Unexpected: The <DFormResourceItem /> do not download a file without 'dformId'.");
      return;
    }

    downloadMutation.mutate({ masterSchemaFieldId, dformId, fileId });
  };

  return <NmpUpload.Item filename={filename} isDisabled={isDisabled} onDownload={downloadFile} />;
};
