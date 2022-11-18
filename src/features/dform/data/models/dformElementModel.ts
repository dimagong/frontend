export enum DformElementTypes {
  // Currently there is no way to migration or fallback
  Block = "field",
  Group = "group",
  Section = "section",
}

export abstract class DformElementModel<IdType> {
  abstract readonly elementType: DformElementTypes;

  constructor(
    readonly id: IdType,
    public conditions: unknown[],
    public isProtected: boolean,
    public isVisibleNonManagers: boolean
  ) {}
}
