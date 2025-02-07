import "./styles.scss";

import { X } from "react-feather";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import React, { useRef } from "react";

import DeprecatedNmpImage from "../DeprecatedNmpImage";

const NmpManageableImageControls = ({ isRemovable, isLoading, onChange, onDelete }) => {
  const fileInputRef = useRef(null);

  const changeImage = () => {
    fileInputRef.current.click();
  };

  const onImageChange = (event) => {
    if (event.target.files.length > 0) {
      onChange(event.target.files[0]);
    }
  };

  return (
    <>
      <Button
        className="manageable-image__change-button"
        onClick={changeImage}
        outline
        size="sm"
        color="primary"
        disabled={isLoading}
      >
        Change
      </Button>

      <input id="manageable-image__input" ref={fileInputRef} type="file" hidden onChange={onImageChange} />

      {isRemovable ? <X className="manageable-image__x-closer" onClick={onDelete} size={20} /> : null}
    </>
  );
};

NmpManageableImageControls.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isRemovable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const DeprecatedNmpManageableImage = (props) => {
  const {
    alt,
    src,
    isLoading,
    isEditable = false,
    isRemovable,
    onDelete,
    onChange,
    width,
    height,
    style,
    className,
  } = props;

  return (
    <div className="manageable-image">
      <DeprecatedNmpImage
        src={src}
        alt={alt}
        isLoading={isLoading}
        width={width}
        height={height}
        style={style}
        className={className}
      >
        {isEditable ? (
          <NmpManageableImageControls
            onChange={onChange}
            onDelete={onDelete}
            isLoading={isLoading}
            isRemovable={isRemovable}
          />
        ) : null}
      </DeprecatedNmpImage>
    </div>
  );
};

DeprecatedNmpManageableImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,

  isLoading: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool,
  isRemovable: PropTypes.bool.isRequired,

  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DeprecatedNmpManageableImage;
