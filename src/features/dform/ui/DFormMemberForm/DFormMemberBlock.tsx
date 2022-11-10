import React from "react";
import { Form } from "antd";
import type { FC } from "react";

import { DFormBlock } from "../DFormBlock";
import { DFormFieldItem } from "../DFormFieldItem";
import { DformSchemaContext } from "../DformSchemaContext";
import { DformBlockId, DformBlockTypes } from "../../data/models";
import { DFormContext } from "../DFormContext";

export type DFormMemberBlockProps = {
  blockId: DformBlockId;
};

export const DFormMemberBlock: FC<DFormMemberBlockProps> = (props) => {
  const { blockId } = props;
  const { isAccessible } = DFormContext.useContext();
  const { dformSchema } = DformSchemaContext.useContext();
  const block = dformSchema.getBlockById(blockId);

  // ToDo: DCR
  // const form = Form.useFormInstance();
  // form.getFieldValue();

  switch (block.blockType) {
    case DformBlockTypes.Field:
      return (
        <DFormFieldItem
          name={block.id}
          minimum={block["minimum"]}
          maximum={block["maximum"]}
          minLength={block["minLength"]}
          maxLength={block["maxLength"]}
          isRequired={block.isRequired}
          key={block.id}
        >
          <DFormBlock
            {...block}
            id={block.id}
            label={block.label}
            blockSize={block.blockSize}
            blockType={block.blockType}
            fieldType={block.fieldType}
            // ToDo DCR
            isDisabled={!isAccessible}
            isRequired={block.isRequired}
            isLabelShowing={block.isLabelShowing}
            masterSchemaFieldId={block.masterSchemaFieldId}
          />
        </DFormFieldItem>
      );
    case DformBlockTypes.HelpText:
      return (
        <DFormBlock id={block.id} helpText={block.helpText} blockSize={block.blockSize} blockType={block.blockType} />
      );
  }
};
