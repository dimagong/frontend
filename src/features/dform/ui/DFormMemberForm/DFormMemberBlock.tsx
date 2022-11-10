import React from "react";
import { Form } from "antd";
import type { FC } from "react";

import { DCRElement } from "../DCR";
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

  switch (block.blockType) {
    case DformBlockTypes.Field:
      return (
        <DCRElement conditions={block.conditions}>
          {({ isDisabled }) => (
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
                isDisabled={!isAccessible || isDisabled}
                isRequired={block.isRequired}
                isLabelShowing={block.isLabelShowing}
                masterSchemaFieldId={block.masterSchemaFieldId}
              />
            </DFormFieldItem>
          )}
        </DCRElement>
      );
    case DformBlockTypes.HelpText:
      return (
        <DFormBlock id={block.id} helpText={block.helpText} blockSize={block.blockSize} blockType={block.blockType} />
      );
  }
};
