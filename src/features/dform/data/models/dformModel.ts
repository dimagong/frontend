import type { DformId } from "./types";
import { DformSchemaModel } from "./dformSchemaModel";

export class DformModel {
  constructor(
    // not finished!
    readonly id: DformId,
    readonly name: string,
    readonly schema: DformSchemaModel
  ) {}
}
