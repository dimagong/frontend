import React from "react";
import type { FC } from "react";

import { DFormElementTypes } from "../../types";
import { DFormResource, DFormResourceProps } from "../DFormResource";
import { DFormHelpText, DFormHelpTextProps } from "../DFormHelpText";

type ElementType<T extends DFormElementTypes> = { elementType: T };

// type FieldType = ElementType<DFormElementTypes.Field> & ;
// @ts-ignore
type ResourceType = ElementType<DFormElementTypes.Resource> & DFormResourceProps;
// @ts-ignore
type HelpTextType = ElementType<DFormElementTypes.HelpText> & DFormHelpTextProps;

type Props = ResourceType | HelpTextType;

export const DFormBlockRenderer: FC<Props> = (props) => {
  switch (props.elementType) {
    // @ts-ignore
    case DFormElementTypes.Resource:
      return (
        <DFormResource
          // @ts-ignore
          label={props.label}
          // @ts-ignore
          isDisabled={props.isDisabled}
          // @ts-ignore
          isLabelShowing={props.isLabelShowing}
          // @ts-ignore
          masterSchemaFieldId={props.masterSchemaFieldId}
        />
      );
    // @ts-ignore
    case DFormElementTypes.HelpText:
      // @ts-ignore
      return <DFormHelpText helpText={props.helpText} />;
    default:
      throw new Error(`Unreachable: A element type is not recognized as block element.`);
  }
};
