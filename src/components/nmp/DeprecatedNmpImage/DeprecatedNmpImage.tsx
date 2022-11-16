import "./styles.scss";

import type { FC } from "react";
import { Progress } from "antd";
import React, { CSSProperties } from "react";

type Props = {
  src?: string;
  alt: string;
  isLoading?: boolean;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
  className?: string;
};

const DeprecatedNmpImage: FC<Props> = ({ src, alt, isLoading, children, width, height, style, className }) => {
  return (
    <div className="nmp-image">
      <img src={src} alt={alt} width={width} height={height} style={style} className={className} />

      {children}

      {isLoading ? (
        <div className="nmp-image__progress">
          <Progress />
        </div>
      ) : null}
    </div>
  );
};

export default DeprecatedNmpImage;
