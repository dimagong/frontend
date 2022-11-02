import React from "react";
import type { FC } from "react";

import { DFormElementTypes } from "../../types";
import { DFormResource, DFormResourceProps } from "../DFormResource";
import { DFormHelpText, DFormHelpTextProps } from "../DFormHelpText";

type ElementType<T extends DFormElementTypes> = { elementType: T };

// type FieldType = ElementType<DFormElementTypes.Field> & ;
type ResourceType = ElementType<DFormElementTypes.Resource> & DFormResourceProps;
type HelpTextType = ElementType<DFormElementTypes.HelpText> & DFormHelpTextProps;

type Props = ResourceType | HelpTextType;

export const DFormBlockRenderer: FC<Props> = (props) => {
  switch (props.elementType) {
    case DFormElementTypes.Resource:
      return (
        <DFormResource
          label={props.label}
          isDisabled={props.isDisabled}
          isLabelShowing={props.isLabelShowing}
          masterSchemaFieldId={props.masterSchemaFieldId}
        />
      );
    case DFormElementTypes.HelpText:
      return <DFormHelpText helpText={props.helpText} />;
    default:
      throw new Error(`Unreachable: A element type is not recognized as block element.`);
  }
};
