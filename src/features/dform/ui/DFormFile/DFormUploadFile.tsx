import React from "react";
import type { FC, DragEvent } from "react";
import { useMutation } from "react-query";
import type { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";

import { NmpUpload } from "features/nmp-ui";
import { triggerFileDownloading, invariant } from "features/common";

import { DFormContext } from "../DFormContext";
import type { DformFileValueType, DformFileListValueType } from "../../data/models";

const getUploadFileFromDFormFile = (dformFile: DformFileValueType): UploadFile => ({
  uid: String(dformFile.file_id),
  name: dformFile.name,
});

type Props = {
  id?: string;
  value?: DformFileListValueType;
  isDisabled?: boolean;
  isMultiple?: boolean;
  isRemovable?: boolean;
  masterSchemaFieldId?: number;
  onChange?: (value: DformFileListValueType) => void;
};

export const DFormUploadFile: FC<Props> = (props) => {
  const { id, value = [], isMultiple = false, isDisabled, isRemovable, masterSchemaFieldId, onChange } = props;

  const { dformId, dformFileService } = DFormContext.useContext();

  const onSuccessUpload = (uploadedData: DformFileListValueType) => {
    if (onChange) {
      onChange(uploadedData);
    }
  };

  const onSuccessDelete = (fileId: number) => {
    if (onChange) {
      const newValue = value.filter(({ file_id }) => file_id !== fileId);

      onChange(newValue);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: dformFileService!.delete.bind(dformFileService),
    // ToDo: resolve that
    // @ts-ignore
    onSuccess: (_, { fileId }) => onSuccessDelete(fileId),
  });
  const uploadMutation = useMutation({
    mutationFn: dformFileService!.post.bind(dformFileService),
    onSuccess: onSuccessUpload,
  });
  const downloadMutation = useMutation({
    mutationFn: dformFileService!.get.bind(dformFileService),
    onSuccess: triggerFileDownloading,
  });

  const fileList = Array.isArray(value) ? value.map(getUploadFileFromDFormFile) : [];

  const downloadFile = (fileId: number) => {
    invariant(dformId, "Can't download without 'dformId'.");
    invariant(masterSchemaFieldId, "Can't download without 'masterSchemaFieldId'.");

    // ToDo: resolve that
    // @ts-ignore
    downloadMutation.mutate({ masterSchemaFieldId, dformId, fileId });
  };

  const uploadFiles = (files: File[]) => {
    invariant(dformId, "Can't download upload 'dformId'.");
    invariant(masterSchemaFieldId, "Can't download upload 'masterSchemaFieldId'.");

    // ToDo: resolve that
    // @ts-ignore
    uploadMutation.mutate({ dformId, masterSchemaFieldId, files });
  };

  const removeFile = (fileId: number) => {
    invariant(dformId, "Can't delete without 'dformId'.");
    invariant(masterSchemaFieldId, "Can't delete without 'masterSchemaFieldId'.");

    // @ts-ignore
    deleteMutation.mutate({ masterSchemaFieldId, dformId, fileId });
  };

  const onUploadChange = (info: UploadChangeParam) => {
    const files = info.fileList.map(({ originFileObj }) => {
      invariant(originFileObj, "The UploadFile.originFileObj is undefined.");
      return originFileObj;
    });

    uploadFiles(files);
  };

  const onUploadDrop = (event: DragEvent<HTMLElement>) => uploadFiles(Array.from(event.dataTransfer.files));

  return (
    <NmpUpload
      id={id}
      fileList={fileList}
      isDisabled={isDisabled || (!isMultiple && fileList.length === 1) || uploadMutation.isLoading}
      isMultiple={isMultiple}
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
