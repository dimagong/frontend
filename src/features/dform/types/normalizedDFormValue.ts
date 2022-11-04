import { DFormValue } from "./dformValue";
import type { DFormFile, DFormFiles } from "./index";

export type NormalizedDFormValue = DFormValue["value"] | DFormFile | DFormFiles;
