import { Opaque } from "features/common";

import { DformBlockModel } from "./dformBlockModel";
import { DformGroupModel } from "./dformGroupModel";
import { DformSectionModel } from "./dformSectionModel";
import { DformElementModel } from "./dformElementModel";

export type DformBlockId = Opaque<string, DformBlockModel>;
export type DformGroupId = Opaque<string, DformGroupModel>;
export type DformSectionId = Opaque<string, DformSectionModel>;
export type DformElementId = DformBlockId | DformGroupId | DformSectionId;

export type InferDformElementId<T> = T extends DformElementModel<infer Id> ? Id : never;

export type DformStringValueType = string;
export type DformNumberValueType = number;
export type DformBooleanValueType = boolean;
export type DformStringsValueType = string[];
// ToDo: refactor it later (camelize)
export type DformFileValueType = { name: string; file_id: number; custom_filename?: string };
export type DformFileListValueType = DformFileValueType[];
export type DformFieldValueType =
  | DformStringValueType
  | DformNumberValueType
  | DformBooleanValueType
  | DformStringsValueType
  | DformFileValueType
  | DformFileListValueType;
