import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Spinner } from "reactstrap";

const DeprecatedNmpImage = ({ src, alt, isLoading, children, wrapperAttrs = {}, ...attrs }) => {
  return (
    <div {...wrapperAttrs} className={classnames("position-relative", wrapperAttrs.className)}>
      <img src={src} alt={alt} {...attrs} />

      {children}

      {isLoading ? (
        <div className="position-absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Spinner color="primary" />
        </div>
      ) : null}
    </div>
  );
};

DeprecatedNmpImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  wrapperAttrs: PropTypes.object,
};

export default DeprecatedNmpImage;
