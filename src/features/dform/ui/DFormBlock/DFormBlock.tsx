import "./style.scss";

import React from "react";
import type { FC } from "react";

import { DFormBlockSizeTypes } from "../../types";
import { DFormSizingBlock } from "../DFormSizing";
import { DFormBlockRenderer, DFormBlockRendererProps } from "./DFormBlockRenderer";

export type DFormBlockProps = DFormBlockRendererProps & {
  blockSize?: DFormBlockSizeTypes;
};

export const DFormBlock: FC<DFormBlockProps> = (props) => {
  const { blockSize, ...blockProps } = props;
  const {
    id,
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
  } = blockProps;

  return (
    <DFormSizingBlock blockSize={blockSize}>
      <div className="dform-block">
        <DFormBlockRenderer
          id={id}
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
        />
      </div>
    </DFormSizingBlock>
  );
};
