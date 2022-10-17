import React from "react";
import type { FC } from "react";
import { useMutation } from "react-query";

import { NmpUpload } from "features/nmp-ui";
import { triggerFileDownloading, warning } from "features/common";

import { useDFormContext } from "components/DForm/DFormContext";
import { DformFileService } from "components/DForm/data/dformFileService";
import type { GetDFormFileParams } from "components/DForm/data/dformFileService";

import { DFormFile } from "../DFormFile/types";

type Props = {
  value?: DFormFile;
  isDisabled?: boolean;
  masterSchemaFieldId: number;
};

export const DFormResourceItem: FC<Props> = (props) => {
  const { value, isDisabled, masterSchemaFieldId } = props;

  const { dformId, isMemberView } = useDFormContext();

  const downloadMutation = useMutation({
    mutationFn: (d: GetDFormFileParams) => getDFormFileService().get(d),
    onSuccess: (fetchedFile) => triggerFileDownloading(fetchedFile),
  });

  const filename = value ? value.name : "unknown resource";

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

  const getDFormFileService = () => (isMemberView ? DformFileService.member : DformFileService.manager);

  return <NmpUpload.Item filename={filename} isDisabled={isDisabled} onDownload={downloadFile} />;
};
