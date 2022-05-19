import React from "react";
import PropTypes from "prop-types";

const NmpImage = ({ src, alt, className, style }) => {
  return <img src={src} alt={alt} className={className} style={style} />;
};

NmpImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
};

export default NmpImage;
