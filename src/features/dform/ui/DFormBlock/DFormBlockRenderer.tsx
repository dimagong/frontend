import React from "react";
import type { FC } from "react";

import { useDevInvariant } from "features/common";

import { DFormField } from "../DFormField";
import { DFormBlockTypes } from "../../types";
import { DFormHelpText } from "../DFormHelpText";
import type { DFormFieldProps } from "../DFormField";
import type { DFormHelpTextProps } from "../DFormHelpText";

type BlockType<T extends DFormBlockTypes> = { blockType: T };

type FieldType = DFormFieldProps & BlockType<DFormBlockTypes.Field>;
type HelpTextType = DFormHelpTextProps & BlockType<DFormBlockTypes.HelpText>;

type PrivateDFormBlocksProps = FieldType | HelpTextType;

export type DFormBlockRendererProps = BlockType<DFormBlockTypes> &
  PartialKey<DFormFieldProps, "fieldType"> &
  DFormHelpTextProps;

export const DFormBlockRenderer: FC<DFormBlockRendererProps> = (props: PrivateDFormBlocksProps) => {
  switch (props.blockType) {
    case DFormBlockTypes.Field:
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useDevInvariant(props.fieldType, "Provide a fieldType to render the <DFormField />");

      return (
        <DFormField
          id={props.id}
          label={props.label}
          format={props.format}
          options={props.options}
          uiStyle={props.uiStyle}
          fieldType={props.fieldType}
          isRequired={props.isRequired}
          isDisabled={props.isDisabled}
          isLabelShowing={props.isLabelShowing}
          masterSchemaFieldId={props.masterSchemaFieldId}
        />
      );
    case DFormBlockTypes.HelpText:
      return <DFormHelpText helpText={props.helpText} />;
  }
};
