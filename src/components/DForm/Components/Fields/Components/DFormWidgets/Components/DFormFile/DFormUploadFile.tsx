import React from "react";
import type { FC, DragEvent } from "react";
import { useMutation } from "react-query";
import type { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";

import { NmpUpload } from "features/nmp-ui";
import { triggerFileDownloading, warning } from "features/common";

import { useDFormContext } from "components/DForm/DFormContext";
import type { DFormFile } from "components/DForm/types/dformFile";
import type { DFormFiles } from "components/DForm/types/dformFiles";
import { DformFileService } from "components/DForm/data/dformFileService";
import type {
  GetDFormFileParams,
  PostDFormFileParams,
  DeleteDFormFileParams,
} from "components/DForm/data/dformFileService";

const getUploadFileFromDFormFile = (dformFile: DFormFile): UploadFile => ({
  uid: String(dformFile.file_id),
  name: dformFile.name,
});

type Props = {
  value?: DFormFiles;
  maxCount?: number;
  isDisabled?: boolean;
  isRemovable?: boolean;
  masterSchemaFieldId: number;
  onChange?: (value: DFormFiles) => void;
};

export const DFormUploadFile: FC<Props> = (props) => {
  const { value = [], maxCount, isDisabled, isRemovable, masterSchemaFieldId, onChange } = props;

  const { dformId, isMemberView } = useDFormContext();

  const getDFormFileService = () => (isMemberView ? DformFileService.member : DformFileService.manager);

  const downloadMutation = useMutation({
    mutationFn: (d: GetDFormFileParams) => getDFormFileService().get(d),
    onSuccess: (fetchedFile) => triggerFileDownloading(fetchedFile),
  });
  const uploadMutation = useMutation({
    mutationFn: (d: PostDFormFileParams) => getDFormFileService().post(d),
    onSuccess: (uploadedData: DFormFiles) => triggerSuccessUploadingChange(uploadedData),
  });
  const deleteMutation = useMutation({
    mutationFn: (d: DeleteDFormFileParams) => getDFormFileService().delete(d),
    onSuccess: (_, { fileId }) => triggerSuccessDeletingChange(fileId),
  });

  const fileList = value.map(getUploadFileFromDFormFile);

  const downloadFile = (fileId: number) => {
    if (!dformId) {
      warning("Unexpected: The <MemberDFormUpload /> do not download a file without 'dformId'.");
      return;
    }

    downloadMutation.mutate({ masterSchemaFieldId, dformId, fileId });
  };

  const uploadFiles = (files: File[]) => {
    if (!dformId) {
      warning("Unexpected: The <MemberDFormUpload /> do not upload files without 'dformId'.");
      return;
    }

    uploadMutation.mutate({ dformId, masterSchemaFieldId, files });
  };

  const removeFile = (fileId: number) => {
    if (!dformId) {
      warning("Unexpected: The <MemberDFormUpload /> do not delete files without 'dformId'.");
      return;
    }

    deleteMutation.mutate({ masterSchemaFieldId, dformId, fileId });
  };

  const triggerSuccessDeletingChange = (fileId: number) => {
    const newValue = value.filter(({ file_id }) => file_id !== fileId);

    if (onChange) {
      onChange(newValue);
    }
  };

  const triggerSuccessUploadingChange = (uploadedData: DFormFiles) => {
    if (onChange) {
      onChange(uploadedData);
    }
  };

  const onUploadChange = (info: UploadChangeParam) => {
    const files = info.fileList.map(({ originFileObj }) => {
      if (!originFileObj) {
        warning(`Unexpected: The 'uploadFile#originFileObj' is undefined in the <MemberDFormUpload />.`);
      }
      return originFileObj as File;
    });

    uploadFiles(files);
  };

  const onUploadDrop = (event: DragEvent<HTMLElement>) => uploadFiles(Array.from(event.dataTransfer.files));

  return (
    <NmpUpload
      maxCount={maxCount}
      fileList={fileList}
      isDisabled={isDisabled || uploadMutation.isLoading}
      itemRender={(_, file) => (
        <NmpUpload.Item
          filename={file.name}
          isRemovable={isRemovable}
          onRemove={() => removeFile(Number(file.uid))}
          onDownload={() => downloadFile(Number(file.uid))}
        />
      )}
      beforeUpload={() => false}
      onChange={onUploadChange}
      onDrop={onUploadDrop}
    />
  );
};
