import { Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { Settings } from "react-feather";

function DependencyEditModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    props.onOpen();
  };

  const handleSave = () => {
    if (props.onSave()) {
      setShow(false);
    }
  };

  const handleDelete = () => {
    setShow(false);
    setTimeout(() => {
      props.onDelete();
    });
  };

  return (
    <div>
      {/* <Button variant="primary" onClick={handleShow} className="text-center">
                <MdSettings/>
            </Button>
             */}
      <Settings size={20} className="cursor-pointer" onClick={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>2UI settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="d-flex justify-content-start">
            <Button onClick={handleSave} variant="primary">
              Save
            </Button>
          </div>
          <div className="d-flex justify-content-end">
            <Button onClick={handleDelete} variant="danger mr-1">
              Delete
            </Button>
            {/* <Button variant="warning" onClick={handleClose}>
                            Cancel
                    </Button> */}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DependencyEditModal;
