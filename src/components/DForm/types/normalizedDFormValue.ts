import { DFormFile } from "./dformFile";
import { DFormFiles } from "./dformFiles";
import { DFormValue } from "./dformValue";

export type NormalizedDFormValue = DFormValue["value"] | DFormFile | DFormFiles;
