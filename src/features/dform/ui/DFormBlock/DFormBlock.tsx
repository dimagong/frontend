import "./style.scss";

import React from "react";
import type { FC } from "react";

import { DFormSizingBlock } from "../DFormSizing";
import { DformBlockSizeTypes } from "../../data/models";
import { DFormBlockRenderer, DFormBlockRendererProps } from "./DFormBlockRenderer";

export type DFormBlockProps = DFormBlockRendererProps & {
  blockSize?: DformBlockSizeTypes;
};

export const DFormBlock: FC<DFormBlockProps> = (props) => {
  const { blockSize, ...blockProps } = props;
  const {
    id,
    value,
    label,
    format,
    uiStyle,
    options,
    helpText,
    blockType,
    fieldType,
    isDisabled,
    isRequired,
    isLabelShowing,
    masterSchemaFieldId,
    onChange,
  } = blockProps;

  return (
    <DFormSizingBlock blockSize={blockSize}>
      <div className="dform-block">
        <DFormBlockRenderer
          id={id}
          value={value}
          label={label}
          format={format}
          options={options}
          uiStyle={uiStyle}
          helpText={helpText}
          blockType={blockType}
          fieldType={fieldType}
          isRequired={isRequired}
          isDisabled={isDisabled}
          isLabelShowing={isLabelShowing}
          masterSchemaFieldId={masterSchemaFieldId}
          onChange={onChange}
        />
      </div>
    </DFormSizingBlock>
  );
};
