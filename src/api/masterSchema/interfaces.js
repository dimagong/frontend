import * as yup from "yup";

export const MasterSchemaInterface = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    organizationId: yup.number().required(),
    organizationType: yup.string().required(),
  })
  .camelCase();

export const MasterSchemaArrayInterface = yup.array(MasterSchemaInterface).test(Array.isArray);

export const MasterSchemaFieldInterface = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    parentId: yup.number().required(),
    updatedAt: yup.string().required(),
    createdAt: yup.string().required(),
    isSystem: yup.boolean().required(),
  })
  .camelCase();

export const MasterSchemaGroupInterface = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    parentId: yup.number().nullable(),
    updatedAt: yup.string().required(),
    createdAt: yup.string().required(),
    isSystem: yup.boolean().required(),
    fields: yup.array(MasterSchemaFieldInterface).test(Array.isArray),
    groups: yup.array(yup.lazy(() => MasterSchemaGroupInterface)).test(Array.isArray),
    isMemberFirmGroup: yup.boolean().required(),
  })
  .camelCase();

export const MasterSchemaHierarchyInterface = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    parentId: yup.number().nullable(),
    masterSchemaId: yup.number().required(),
    updatedAt: yup.string().required(),
    createdAt: yup.string().required(),
    fields: yup.array(MasterSchemaFieldInterface).test(Array.isArray),
    groups: yup.array(MasterSchemaGroupInterface).test(Array.isArray),
    isMemberFirmGroup: yup.boolean().required(),
  })
  .camelCase()
  .nullable();
