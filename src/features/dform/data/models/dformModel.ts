import { DformAccessTypes } from "../../types";
import { DformSchemaModel } from "./dformSchemaModel";
import type { DformId, DformSectionId } from "./types";

export class DformModel {
  constructor(
    readonly id: DformId,
    readonly name: string,
    readonly status: string,
    readonly schema: DformSchemaModel,
    readonly accessType: DformAccessTypes,
    readonly viewedSections: DformSectionId[]
  ) {}
}
