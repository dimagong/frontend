import "./styles.scss";

import { X } from "react-feather";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Button, Spinner } from "reactstrap";

import NmpImage from "../NmpImage";

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

const NmpManageableImage = (props) => {
  const { alt, src, isLoading, isEditable = false, isRemovable, onDelete, onChange, className, style } = props;

  return (
    <div className="manageable-image position-relative">
      <NmpImage src={src} alt={alt} style={style} className={className} />

      {isEditable ? (
        <NmpManageableImageControls
          onChange={onChange}
          onDelete={onDelete}
          isLoading={isLoading}
          isRemovable={isRemovable}
        />
      ) : null}

      {isLoading ? (
        <div className="manageable-image__spinner-wrapper">
          <Spinner color="primary" />
        </div>
      ) : null}
    </div>
  );
};

NmpManageableImage.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string,

  isLoading: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool,
  isRemovable: PropTypes.bool.isRequired,

  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default NmpManageableImage;
