import { DFormTemplateBlockModel } from "./dformTemplateBlockModel";
import { DFormTemplateGroupModel } from "./dformTemplateGroupModel";
import { DFormTemplateSectionModel } from "./dformTemplateSectionModel";

export class DFormTemplateSchemaModel {
  blocks: Array<DFormTemplateBlockModel>;
  groups: Array<DFormTemplateGroupModel>;
  sections: Array<DFormTemplateSectionModel>;
  relatedSections: Array<string>;
}
