import React from "react";
import type { FC } from "react";

import { useDevInvariant } from "features/common";

import { DFormField } from "../DFormField";
import { DFormHelpText } from "../DFormHelpText";
import { DformBlockTypes } from "../../data/models";
import type { DFormFieldProps } from "../DFormField";
import type { DFormHelpTextProps } from "../DFormHelpText";

type BlockType<T extends DformBlockTypes> = { blockType: T };

type FieldType = DFormFieldProps & BlockType<DformBlockTypes.Field>;
type HelpTextType = DFormHelpTextProps & BlockType<DformBlockTypes.HelpText>;

type PrivateDFormBlocksProps = FieldType | HelpTextType;

export type DFormBlockRendererProps = BlockType<DformBlockTypes> &
  PartialKey<DFormFieldProps, "fieldType"> &
  DFormHelpTextProps;

export const DFormBlockRenderer: FC<DFormBlockRendererProps> = (props: PrivateDFormBlocksProps) => {
  switch (props.blockType) {
    case DformBlockTypes.Field:
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
    case DformBlockTypes.HelpText:
      return <DFormHelpText helpText={props.helpText} />;
  }
};
