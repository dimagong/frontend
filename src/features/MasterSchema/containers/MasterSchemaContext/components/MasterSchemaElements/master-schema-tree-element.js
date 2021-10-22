//import PropTypes from 'prop-types';
import { Fade } from 'reactstrap';
import React, { useEffect, useRef, useState } from 'react';

const invariant = (value, throwable) => {
  if (!value) {
    return;
  }

  throw throwable;
};

const useToggle = (initial) => {
  const [state, setState] = useState(initial);
  const toggleState = () => setState((prev) => !prev);

  return [state, toggleState, setState];
};

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const outsideClickHandler = ({ target }) =>
      ref.current && !ref.current.contains(target) && callback();

    document.addEventListener('mousedown', outsideClickHandler);

    return () => document.removeEventListener('mousedown', outsideClickHandler);
  }, [ref, callback]);
};

const MSTreeNodeCreatorPopup = ({ onElement, onCategory, children }) => {
  const fadeRef = useRef(null);
  const [fadeIn, toggleFadeIn, setFadeIn] = useToggle(false);

  useOutsideClick(fadeRef, () => setFadeIn(false));

  return (
    <>
      <Fade in={fadeIn} mountOnEnter unmountOnExit innerRef={fadeRef}>
        <button onClick={onElement}>Create element</button>
        <button onClick={onCategory}>Create category</button>
      </Fade>
      {children({ toggle: toggleFadeIn })}
    </>
  );
};

const MSTreeNode = ({ name, type, createdAt }) => {
  return (
    <div className="element">
      <span>Name: { name }</span>
      <span>Type: { type }</span>
      <span>Created at: { createdAt }</span>

      <MSTreeNodeCreatorPopup
        onElement={() => alert('Create element.')}
        onCategory={() => alert('Create category.')}
      >
        {({ toggle }) => (
          <button onClick={toggle}>Create node</button>
        )}
      </MSTreeNodeCreatorPopup>
    </div>
  );
};

const MSTreeCategory = ({ name, type, createdAt, children }) => {
  return (
    <div className="category">
      <MSTreeNode name={name} type={type} createdAt={createdAt} />
      {children}
    </div>
  );
};

const MSTreeElement = ({ name, type, parent, createdAt, children }) => {
  return parent ? (
    <MSTreeCategory name={name} type={type} createdAt={createdAt}>
      {children}
    </MSTreeCategory>
  ) : (
    <MSTreeElement name={name} type={type} createdAt={createdAt} />
  );
};

//MasterSchemaTreeElement.propTypes = {
//
//};

export default MSTreeElement;
