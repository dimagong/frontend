import { DFormFiles } from "./dformFiles";

export type DFormValue = {
  files: DFormFiles | null;
  value: string | number | boolean | Array<string> | null;
  master_schema_field_id: number;
};
